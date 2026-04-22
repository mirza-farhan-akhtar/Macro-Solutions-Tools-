<?php

namespace App\Http\Controllers\Finance;

use App\Models\Invoice;
use App\Models\Expense;
use App\Models\Income;
use App\Models\Payment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;

class FinanceDashboardController extends Controller
{
    /**
     * Get dashboard metrics
     * GET /api/finance/dashboard
     */
    public function dashboard(Request $request)
    {
        try {
            $period = $request->has('period') ? $request->period : 'month'; // month, quarter, year
            $startDate = $this->getStartDate($period);
            $endDate = Carbon::now();

            // Calculate metrics
            $totalRevenue = Income::where('status', 'completed')
                ->whereBetween('received_at', [$startDate, $endDate])
                ->sum('amount');

            $totalExpenses = Expense::whereIn('status', ['pending', 'approved'])
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->sum('amount');

            $netProfit = $totalRevenue - $totalExpenses;
            $profitMargin = $totalRevenue > 0 ? ($netProfit / $totalRevenue) * 100 : 0;

            // Invoice metrics
            $invoicesCount = Invoice::whereBetween('issued_date', [$startDate, $endDate])->count();
            $paidInvoices = Invoice::where('status', 'paid')
                ->whereBetween('issued_date', [$startDate, $endDate])
                ->sum('total_amount');
            $pendingAmount = Invoice::whereIn('status', ['sent', 'partial', 'overdue'])
                ->whereBetween('issued_date', [$startDate, $endDate])
                ->sum('total_amount');

            // Expense metrics
            $expenseCount = Expense::whereIn('status', ['pending', 'approved'])
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->count();

            // Payment metrics
            $totalPayments = Payment::whereBetween('paid_at', [$startDate, $endDate])->sum('amount');
            $paymentMethods = Payment::whereBetween('paid_at', [$startDate, $endDate])
                ->selectRaw('payment_method, COUNT(*) as count, SUM(amount) as total')
                ->groupBy('payment_method')
                ->get()
                ->toArray();

            // Monthly trend (combine revenue and expenses)
            $monthlyTrend = $this->getCombinedMonthlyTrend($startDate, $endDate);

            return response()->json([
                'success' => true,
                'data' => [
                    'period' => $period,
                    'date_range' => [
                        'start' => $startDate->format('Y-m-d'),
                        'end' => $endDate->format('Y-m-d'),
                    ],
                    'metrics' => [
                        'total_revenue' => $totalRevenue,
                        'total_expenses' => $totalExpenses,
                        'net_profit' => $netProfit,
                        'profit_margin' => round($profitMargin, 2),
                    ],
                    'invoices' => [
                        'count' => $invoicesCount,
                        'paid_amount' => $paidInvoices,
                        'pending_amount' => $pendingAmount,
                    ],
                    'expenses' => [
                        'count' => $expenseCount,
                        'total' => $totalExpenses,
                    ],
                    'payments' => $paymentMethods,
                    'monthly_trend' => $monthlyTrend,
                ],
                'message' => 'Dashboard metrics retrieved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving dashboard: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get P&L statement
     * GET /api/finance/reports/profit-loss
     */
    public function profitLoss(Request $request)
    {
        try {
            $period = $request->has('period') ? $request->period : 'month';
            $startDate = $this->getStartDate($period);
            $endDate = Carbon::now();

            // Revenue breakdown
            $revenueBySource = Income::where('status', 'completed')
                ->whereBetween('received_at', [$startDate, $endDate])
                ->selectRaw('source, SUM(amount) as total, COUNT(*) as count')
                ->groupBy('source')
                ->get()
                ->toArray();

            $totalIncome = array_sum(array_column($revenueBySource, 'total'));

            // Expense breakdown
            $expenseByCategory = Expense::whereIn('status', ['pending', 'approved'])
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->with('category')
                ->selectRaw('category_id, SUM(amount) as total, COUNT(*) as count')
                ->groupBy('category_id')
                ->get();

            $expenseByCategoryFormatted = $expenseByCategory->map(function ($item) {
                return [
                    'category' => $item->category->name ?? 'Unknown',
                    'total' => $item->total,
                    'count' => $item->count,
                ];
            })->toArray();

            $totalExpense = array_sum(array_column($expenseByCategoryFormatted, 'total'));

            $grossProfit = $totalIncome - $totalExpense;
            $profitMargin = $totalIncome > 0 ? ($grossProfit / $totalIncome) * 100 : 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'period' => $period,
                    'date_range' => [
                        'start' => $startDate->format('Y-m-d'),
                        'end' => $endDate->format('Y-m-d'),
                    ],
                    'income' => [
                        'by_source' => $revenueBySource,
                        'total' => $totalIncome,
                    ],
                    'expense' => [
                        'by_category' => $expenseByCategoryFormatted,
                        'total' => $totalExpense,
                    ],
                    'summary' => [
                        'gross_profit' => $grossProfit,
                        'profit_margin' => round($profitMargin, 2),
                    ],
                ],
                'message' => 'P&L statement generated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generating P&L statement: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get revenue breakdown by client
     * GET /api/finance/reports/revenue
     */
    public function revenue(Request $request)
    {
        try {
            $period = $request->has('period') ? $request->period : 'month';
            $startDate = $this->getStartDate($period);
            $endDate = Carbon::now();

            // Revenue by client
            $revenueByClient = Income::where('status', 'completed')
                ->whereBetween('received_at', [$startDate, $endDate])
                ->with('client:id,name')
                ->selectRaw('client_id, SUM(amount) as total, COUNT(*) as count')
                ->groupBy('client_id')
                ->get()
                ->map(function ($item) {
                    return [
                        'client' => $item->client->name ?? 'Direct Income',
                        'total' => $item->total,
                        'count' => $item->count,
                    ];
                })
                ->toArray();

            // Revenue by payment method
            $revenueByMethod = Income::where('status', 'completed')
                ->whereBetween('received_at', [$startDate, $endDate])
                ->selectRaw('payment_method, SUM(amount) as total, COUNT(*) as count')
                ->groupBy('payment_method')
                ->get()
                ->toArray();

            // Monthly revenue trend
            $monthlyTrend = $this->getMonthlyRevenueTrend($startDate, $endDate);

            $totalRevenue = array_sum(array_column($revenueByClient, 'total'));

            return response()->json([
                'success' => true,
                'data' => [
                    'period' => $period,
                    'date_range' => [
                        'start' => $startDate->format('Y-m-d'),
                        'end' => $endDate->format('Y-m-d'),
                    ],
                    'total_revenue' => $totalRevenue,
                    'by_client' => $revenueByClient,
                    'by_payment_method' => $revenueByMethod,
                    'monthly_trend' => $monthlyTrend,
                ],
                'message' => 'Revenue report generated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generating revenue report: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get expense breakdown
     * GET /api/finance/reports/expense
     */
    public function expense(Request $request)
    {
        try {
            $period = $request->has('period') ? $request->period : 'month';
            $startDate = $this->getStartDate($period);
            $endDate = Carbon::now();

            // Expense by category
            $expenseByCategory = Expense::whereIn('status', ['pending', 'approved'])
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->with('category')
                ->selectRaw('category_id, SUM(amount) as total, COUNT(*) as count')
                ->groupBy('category_id')
                ->get()
                ->map(function ($item) {
                    return [
                        'category' => $item->category->name ?? 'Unknown',
                        'total' => $item->total,
                        'count' => $item->count,
                    ];
                })
                ->toArray();

            // Expense by payment method
            $expenseByMethod = Expense::whereIn('status', ['pending', 'approved'])
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->selectRaw('payment_method, SUM(amount) as total, COUNT(*) as count')
                ->groupBy('payment_method')
                ->get()
                ->toArray();

            // Monthly expense trend
            $monthlyTrend = $this->getMonthlyExpenseTrend($startDate, $endDate);

            $totalExpense = array_sum(array_column($expenseByCategory, 'total'));

            return response()->json([
                'success' => true,
                'data' => [
                    'period' => $period,
                    'date_range' => [
                        'start' => $startDate->format('Y-m-d'),
                        'end' => $endDate->format('Y-m-d'),
                    ],
                    'total_expense' => $totalExpense,
                    'by_category' => $expenseByCategory,
                    'by_payment_method' => $expenseByMethod,
                    'monthly_trend' => $monthlyTrend,
                ],
                'message' => 'Expense report generated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generating expense report: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Export report as CSV
     * GET /api/finance/reports/export
     */
    public function export(Request $request)
    {
        try {
            $type = $request->has('type') ? $request->type : 'profit-loss'; // profit-loss, revenue, expense
            $period = $request->has('period') ? $request->period : 'month';
            $startDate = $this->getStartDate($period);
            $endDate = Carbon::now();

            $filename = "finance-report-{$type}-" . Carbon::now()->format('Y-m-d') . '.csv';
            $handle = fopen('php://temp', 'w');

            if ($type === 'profit-loss') {
                $this->exportProfitLoss($handle, $startDate, $endDate);
            } elseif ($type === 'revenue') {
                $this->exportRevenue($handle, $startDate, $endDate);
            } elseif ($type === 'expense') {
                $this->exportExpense($handle, $startDate, $endDate);
            }

            rewind($handle);
            $csv = stream_get_contents($handle);
            fclose($handle);

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error exporting report: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Helper methods

    private function getStartDate($period)
    {
        return match ($period) {
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            'quarter' => Carbon::now()->subMonths(3),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth(),
        };
    }

    private function getMonthlyRevenueTrend($startDate, $endDate)
    {
        $months = $startDate->diffInMonths($endDate) + 1;
        $trend = [];

        for ($i = 0; $i < $months; $i++) {
            $date = $startDate->copy()->addMonths($i);
            $amount = Income::where('status', 'completed')
                ->whereYear('received_at', $date->year)
                ->whereMonth('received_at', $date->month)
                ->sum('amount');

            $trend[] = [
                'month' => $date->format('M Y'),
                'revenue' => $amount,
            ];
        }

        return $trend;
    }

    private function getMonthlyExpenseTrend($startDate, $endDate)
    {
        $months = $startDate->diffInMonths($endDate) + 1;
        $trend = [];

        for ($i = 0; $i < $months; $i++) {
            $date = $startDate->copy()->addMonths($i);
            $amount = Expense::whereIn('status', ['pending', 'approved'])
                ->whereYear('expense_date', $date->year)
                ->whereMonth('expense_date', $date->month)
                ->sum('amount');

            $trend[] = [
                'month' => $date->format('M Y'),
                'expense' => $amount,
            ];
        }

        return $trend;
    }

    private function getCombinedMonthlyTrend($startDate, $endDate)
    {
        $months = $startDate->diffInMonths($endDate) + 1;
        $trend = [];

        for ($i = 0; $i < $months; $i++) {
            $date = $startDate->copy()->addMonths($i);
            $revenue = Income::where('status', 'completed')
                ->whereYear('received_at', $date->year)
                ->whereMonth('received_at', $date->month)
                ->sum('amount');

            $expenses = Expense::whereIn('status', ['pending', 'approved'])
                ->whereYear('expense_date', $date->year)
                ->whereMonth('expense_date', $date->month)
                ->sum('amount');

            $trend[] = [
                'month' => $date->format('M Y'),
                'revenue' => $revenue,
                'expenses' => $expenses,
            ];
        }

        return $trend;
    }

    private function exportProfitLoss($handle, $startDate, $endDate)
    {
        fputcsv($handle, ['Profit & Loss Statement', '', date('Y-m-d')]);
        fputcsv($handle, ['Period', $startDate->format('Y-m-d') . ' to ' . $endDate->format('Y-m-d')]);
        fputcsv($handle, []);

        // Revenue section
        fputcsv($handle, ['REVENUE']);
        $revenues = Income::where('status', 'completed')
            ->whereBetween('received_at', [$startDate, $endDate])
            ->selectRaw('source, SUM(amount) as total')
            ->groupBy('source')
            ->get();

        foreach ($revenues as $revenue) {
            fputcsv($handle, [$revenue->source, $revenue->total]);
        }
        $totalRevenue = $revenues->sum('total');
        fputcsv($handle, ['Total Revenue', $totalRevenue]);
        fputcsv($handle, []);

        // Expense section
        fputcsv($handle, ['EXPENSES']);
        $expenses = Expense::where('status', 'approved')
            ->whereBetween('expense_date', [$startDate, $endDate])
            ->with('category')
            ->selectRaw('category_id, SUM(amount) as total')
            ->groupBy('category_id')
            ->get();

        foreach ($expenses as $expense) {
            fputcsv($handle, [$expense->category->name ?? 'Unknown', $expense->total]);
        }
        $totalExpense = $expenses->sum('total');
        fputcsv($handle, ['Total Expenses', $totalExpense]);
        fputcsv($handle, []);

        // Summary
        fputcsv($handle, ['NET PROFIT', $totalRevenue - $totalExpense]);
        $profitMargin = $totalRevenue > 0 ? (($totalRevenue - $totalExpense) / $totalRevenue) * 100 : 0;
        fputcsv($handle, ['Profit Margin %', round($profitMargin, 2)]);
    }

    private function exportRevenue($handle, $startDate, $endDate)
    {
        fputcsv($handle, ['Revenue Report', '', date('Y-m-d')]);
        fputcsv($handle, []);
        fputcsv($handle, ['Client', 'Count', 'Total Amount']);

        $revenues = Income::where('status', 'completed')
            ->whereBetween('received_at', [$startDate, $endDate])
            ->with('client:id,name')
            ->selectRaw('client_id, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('client_id')
            ->get();

        foreach ($revenues as $revenue) {
            fputcsv($handle, [
                $revenue->client->name ?? 'Direct',
                $revenue->count,
                $revenue->total,
            ]);
        }
    }

    private function exportExpense($handle, $startDate, $endDate)
    {
        fputcsv($handle, ['Expense Report', '', date('Y-m-d')]);
        fputcsv($handle, []);
        fputcsv($handle, ['Category', 'Count', 'Total Amount']);

        $expenses = Expense::where('status', 'approved')
            ->whereBetween('expense_date', [$startDate, $endDate])
            ->with('category')
            ->selectRaw('category_id, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('category_id')
            ->get();

        foreach ($expenses as $expense) {
            fputcsv($handle, [
                $expense->category->name ?? 'Unknown',
                $expense->count,
                $expense->total,
            ]);
        }
    }
}
