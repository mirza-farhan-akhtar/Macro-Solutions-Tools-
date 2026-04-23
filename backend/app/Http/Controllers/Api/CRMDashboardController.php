<?php

namespace App\Http\Controllers\Api;

use App\Models\Lead;
use App\Models\Deal;
use App\Models\Client;
use App\Models\Activity;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CRMDashboardController extends BaseController
{
    public function index(): JsonResponse
    {
        $this->authorize('crm.dashboard');

        $userId = auth()->id();
        $isSuperAdmin = auth()->user()->isSuperAdmin();

        // Get metrics based on user role
        $leadsCriteria = $isSuperAdmin ? Lead::query() : Lead::where('assigned_to', $userId);
        $dealsCriteria = $isSuperAdmin ? Deal::query() : Deal::where('assigned_to', $userId);

        $metrics = [
            'total_leads' => $leadsCriteria->count(),
            'qualified_leads' => $leadsCriteria->where('lead_status', 'qualified')->count(),
            'deals_in_pipeline' => $dealsCriteria->whereNotIn('stage', ['won', 'lost'])->count(),
            'revenue_this_month' => $dealsCriteria->won()
                ->whereMonth('won_date', now()->month)
                ->whereYear('won_date', now()->year)
                ->sum('value'),
            'conversion_rate' => $this->calculateConversionRate($leadsCriteria),
            'lost_deals' => $dealsCriteria->where('stage', 'lost')->count(),
            'won_deals_this_month' => $dealsCriteria->won()
                ->whereMonth('won_date', now()->month)
                ->whereYear('won_date', now()->year)
                ->count(),
        ];

        // Sales Funnel
        $salesFunnel = $this->getSalesFunnel($dealsCriteria);

        // Revenue Trend (last 12 months)
        $revenueTrend = $this->getRevenueTrend($dealsCriteria);

        // Lead Source Distribution
        $leadSources = $this->getLeadSourceDistribution($leadsCriteria);

        // Sales by Executive (for super admin)
        $salesByExecutive = $isSuperAdmin ? $this->getSalesByExecutive() : null;

        // Recent activities
        $recentActivities = Activity::with('creator', 'assignedUser')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Upcoming follow-ups
        $upcomingFollowUps = Activity::incomplete()
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '>=', now())
            ->where('scheduled_at', '<=', now()->addDays(7))
            ->with('creator', 'assignedUser')
            ->orderBy('scheduled_at')
            ->get();

        // Recently won deals
        $recentlyWonDeals = Deal::where('stage', 'won')
            ->orderBy('won_date', 'desc')
            ->with('client', 'assignedUser')
            ->limit(5)
            ->get();

        return $this->respond([
            'data' => [
                'metrics' => $metrics,
                'sales_funnel' => $salesFunnel,
                'revenue_trend' => $revenueTrend,
                'lead_sources' => $leadSources,
                'sales_by_executive' => $salesByExecutive,
                'recent_activities' => $recentActivities,
                'upcoming_follow_ups' => $upcomingFollowUps,
                'recently_won_deals' => $recentlyWonDeals,
            ]
        ]);
    }

    private function calculateConversionRate($leadsCriteria)
    {
        $totalLeads = (clone $leadsCriteria)->count();
        if ($totalLeads === 0) return 0;

        // True conversion rate: won deals / total leads
        $wonDeals = Deal::where('stage', 'won')->count();
        return round(min(($wonDeals / $totalLeads) * 100, 100), 2);
    }

    private function getSalesFunnel($dealsCriteria)
    {
        $stages = ['qualification', 'proposal', 'negotiation', 'won', 'lost'];
        $funnel = [];

        foreach ($stages as $stage) {
            $count = (clone $dealsCriteria)->where('stage', $stage)->count();
            $value = (clone $dealsCriteria)->where('stage', $stage)->sum('value');

            $funnel[] = [
                'stage' => $stage,
                'count' => $count,
                'value' => $value,
            ];
        }

        return $funnel;
    }

    private function getRevenueTrend($dealsCriteria)
    {
        $trend = [];

        for ($i = 11; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $revenue = (clone $dealsCriteria)->won()
                ->whereMonth('won_date', $month->month)
                ->whereYear('won_date', $month->year)
                ->sum('value');

            $trend[] = [
                'month' => $month->format('M Y'),
                'revenue' => $revenue,
            ];
        }

        return $trend;
    }

    private function getLeadSourceDistribution($leadsCriteria)
    {
        $sources = (clone $leadsCriteria)
            ->select('source')
            ->groupBy('source')
            ->selectRaw('count(*) as count')
            ->get()
            ->map(function ($item) {
                return [
                    'source' => $item->source ? $item->source : 'Unknown',
                    'count' => $item->count,
                ];
            });

        return $sources;
    }

    private function getSalesByExecutive()
    {
        $users = \App\Models\User::with(['dealsAssigned' => function ($q) {
            $q->where('stage', 'won');
        }])->get();

        return $users->map(function ($user) {
            return [
                'user_id' => $user->id,
                'name' => $user->name,
                'value' => $user->dealsAssigned?->sum('value') ?? 0,
                'deals_won' => $user->dealsAssigned?->count() ?? 0,
            ];
        });
    }
}
