<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Service;
use App\Models\Lead;
use App\Models\Blog;
use App\Models\Application;
use App\Models\Appointment;
use App\Models\Project;
use App\Models\ProjectTask;
use App\Models\ChatSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $currentMonth = now()->month;
        $lastMonth = now()->subMonth()->month;
        $user = auth()->user();

        $stats = [
            'users' => [
                'total' => User::count(),
                'change' => $this->calculatePercentageChange(
                    User::whereMonth('created_at', $currentMonth)->count(),
                    User::whereMonth('created_at', $lastMonth)->count()
                ),
            ],
            'services' => [
                'total' => Service::where('status', 'published')->count(),
                'change' => $this->calculatePercentageChange(
                    Service::whereMonth('created_at', $currentMonth)->count(),
                    Service::whereMonth('created_at', $lastMonth)->count()
                ),
            ],
            'leads' => [
                'total' => Lead::whereMonth('created_at', $currentMonth)->count(),
                'change' => $this->calculatePercentageChange(
                    Lead::whereMonth('created_at', $currentMonth)->count(),
                    Lead::whereMonth('created_at', $lastMonth)->count()
                ),
            ],
            'revenue' => [
                'total' => 125750,
                'change' => 12.5,
            ],
        ];

        // Add project statistics based on user permissions
        if ($user && ($user->isSuperAdmin() || $user->headsOfDepartments->isNotEmpty())) {
            $projectQuery = Project::query();
            
            // Filter projects based on user permissions
            if (!$user->isSuperAdmin() && $user->headsOfDepartments->isNotEmpty()) {
                $departmentIds = $user->headsOfDepartments->pluck('id');
                $projectQuery->whereHas('departments', function ($q) use ($departmentIds) {
                    $q->whereIn('department_id', $departmentIds);
                });
            }
            
            $stats['projects'] = [
                'total' => $projectQuery->count(),
                'active' => $projectQuery->active()->count(),
                'completed' => $projectQuery->completed()->count(),
                'change' => $this->calculatePercentageChange(
                    $projectQuery->whereMonth('created_at', $currentMonth)->count(),
                    $projectQuery->whereMonth('created_at', $lastMonth)->count()
                ),
            ];
        }

        // Add task statistics for employees
        if ($user) {
            $taskQuery = $user->assignedTasks();
            
            $stats['tasks'] = [
                'assigned' => $taskQuery->count(),
                'active' => $taskQuery->active()->count(),
                'completed' => $taskQuery->completed()->count(),
                'overdue' => $taskQuery->overdue()->count(),
            ];
        }

        return response()->json($stats);
    }

    public function charts()
    {
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $months[] = now()->subMonths($i)->format('M Y');
        }

        $leadsData = [];
        $revenueData = [];
        $blogViewsData = [];
        $applicationsData = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            
            $leadsData[] = Lead::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
            
            $revenueData[] = rand(15000, 35000);
            
            $blogViewsData[] = Blog::whereYear('created_at', '<=', $date->year)
                ->whereMonth('created_at', '<=', $date->month)
                ->sum('views') / 100;
            
            $applicationsData[] = Application::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
        }

        return response()->json([
            'labels' => $months,
            'leads' => $leadsData,
            'revenue' => [
                'income' => $revenueData,
                'expense' => array_map(fn($v) => $v * 0.6, $revenueData),
            ],
            'blogViews' => $blogViewsData,
            'applications' => $applicationsData,
        ]);
    }

    public function activity()
    {
        return response()->json([
            'leads' => Lead::with('assignedUser')->latest()->take(5)->get(),
            'applications' => Application::with('career')->latest()->take(5)->get(),
            'blogs' => Blog::with('author')->latest()->take(5)->get(),
        ]);
    }

    private function calculatePercentageChange($current, $previous)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }
        
        return round((($current - $previous) / $previous) * 100, 1);
    }

    public function notifications(Request $request)
    {
        $user = $request->user();

        // Determine if this user is employee-only (no admin privileges)
        $employeeOnlySlugs = ['employee', 'developer', 'finance-employee'];
        $userRoleSlugs = $user->roles->pluck('slug')->toArray();
        $isEmployeeOnly = !$user->isAdmin() && !$user->isSuperAdmin()
            && count($userRoleSlugs) > 0
            && collect($userRoleSlugs)->every(fn($s) => in_array($s, $employeeOnlySlugs));

        if ($isEmployeeOnly) {
            return $this->employeeNotifications($user);
        }

        // â”€â”€ Admin / HR notifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        $newLeads = Lead::where('status', 'new')->count();
        $newApplications = Application::where('status', 'pending')->count();
        $newAppointments = Appointment::where('status', 'pending')->count();
        $chatRequests = ChatSession::where('status', 'human_requested')->count();

        $recentLeads = Lead::where('status', 'new')->latest()->take(5)->get(['id', 'name', 'email', 'subject', 'created_at']);
        $recentApplications = Application::where('status', 'pending')->with('career:id,title')->latest()->take(5)->get(['id', 'applicant_name', 'applicant_email', 'career_id', 'created_at']);
        $recentAppointments = Appointment::where('status', 'pending')->latest()->take(5)->get(['id', 'name', 'email', 'service', 'date', 'created_at']);
        $recentChatRequests = ChatSession::where('status', 'human_requested')
            ->latest()
            ->take(5)
            ->get(['id', 'visitor_name', 'visitor_email', 'human_requested_at', 'created_at']);

        return response()->json([
            'type' => 'admin',
            'counts' => [
                'leads'        => $newLeads,
                'applications' => $newApplications,
                'appointments' => $newAppointments,
                'chat_requests'=> $chatRequests,
                'total'        => $newLeads + $newApplications + $newAppointments + $chatRequests,
            ],
            'recent' => [
                'leads'         => $recentLeads,
                'applications'  => $recentApplications,
                'appointments'  => $recentAppointments,
                'chat_requests' => $recentChatRequests,
            ],
        ]);
    }

    private function employeeNotifications($user)
    {
        $employee = \App\Models\Employee::where('user_id', $user->id)->first();

        // Pending leave requests submitted by this employee
        $pendingLeaves = 0;
        $recentLeaves = [];
        if ($employee) {
            $pendingLeaves = \App\Models\LeaveRequest::where('employee_id', $employee->id)
                ->where('status', 'Pending')
                ->count();
            $recentLeaves = \App\Models\LeaveRequest::where('employee_id', $employee->id)
                ->where('status', 'Pending')
                ->latest()
                ->take(3)
                ->get(['id', 'leave_type', 'start_date', 'end_date', 'status']);
        }

        // Upcoming meetings in next 7 days where user is organizer or attendee
        $upcomingMeetings = \App\Models\Meeting::where('meeting_date', '>=', now()->toDateString())
            ->where('meeting_date', '<=', now()->addDays(7)->toDateString())
            ->where(function ($q) use ($user) {
                $q->where('organizer_id', $user->id)
                  ->orWhereJsonContains('attendee_user_ids', $user->id);
            })
            ->count();
        $recentMeetings = \App\Models\Meeting::where('meeting_date', '>=', now()->toDateString())
            ->where('meeting_date', '<=', now()->addDays(7)->toDateString())
            ->where(function ($q) use ($user) {
                $q->where('organizer_id', $user->id)
                  ->orWhereJsonContains('attendee_user_ids', $user->id);
            })
            ->orderBy('meeting_date')
            ->take(3)
            ->get(['id', 'title', 'meeting_date', 'meeting_time', 'location']);

        // Today's attendance â€” notify if employee hasn't checked in yet
        $todayAttendance = $employee
            ? \App\Models\Attendance::where('employee_id', $employee->id)
                ->whereDate('date', today())
                ->first()
            : null;
        $notCheckedIn = $employee && !$todayAttendance;

        $total = $pendingLeaves + $upcomingMeetings + ($notCheckedIn ? 1 : 0);

        return response()->json([
            'type' => 'employee',
            'counts' => [
                'leaves'      => $pendingLeaves,
                'meetings'    => $upcomingMeetings,
                'attendance'  => $notCheckedIn ? 1 : 0,
                'total'       => $total,
            ],
            'recent' => [
                'leaves'        => $recentLeaves,
                'meetings'      => $recentMeetings,
                'not_checked_in' => $notCheckedIn,
            ],
        ]);
    }
}
