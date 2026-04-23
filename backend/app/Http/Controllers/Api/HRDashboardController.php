<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\Career;
use App\Models\Application;
use Illuminate\Http\Request;

class HRDashboardController extends Controller
{
    public function dashboard()
    {
        // Metrics
        $totalEmployees = Employee::where('status', '!=', 'Terminated')->count();
        $activeEmployees = Employee::where('status', 'Active')->count();
        $openPositions = Career::where('hiring_status', 'Open')->count();
        $applicationsThisMonth = Application::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)->count();
        $pendingInterviews = Application::where('application_status', 'Interview Scheduled')
            ->where('interview_date', '>=', now())
            ->count();
        $approvedLeaves = LeaveRequest::where('status', 'Approved')
            ->where('end_date', '>=', now())
            ->count();

        // Hiring trend (last 6 months)
        $hiringTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $count = Employee::whereMonth('joining_date', $date->month)
                ->whereYear('joining_date', $date->year)
                ->count();
            $hiringTrend[] = [
                'month' => $date->format('M'),
                'count' => $count,
            ];
        }

        // Department distribution
        $departments = Employee::where('status', '!=', 'Terminated')
            ->groupBy('department')
            ->selectRaw('department, COUNT(*) as count')
            ->get();
        $departmentData = $departments->map(fn($d) => [
            'name' => $d->department,
            'value' => $d->count,
        ]);

        // Attendance summary (current month)
        $attendanceSummary = Attendance::whereMonth('date', now()->month)
            ->groupBy('status')
            ->selectRaw('status, COUNT(*) as count')
            ->get();
        $attendanceData = $attendanceSummary->map(fn($a) => [
            'status' => $a->status,
            'count' => $a->count,
        ]);

        // Leave statistics
        $leaves = LeaveRequest::where('status', 'Approved')
            ->selectRaw('leave_type, COUNT(*) as count')
            ->groupBy('leave_type')
            ->get();
        $leaveData = $leaves->map(fn($l) => [
            'type' => $l->leave_type,
            'count' => $l->count,
        ]);

        // Recent activities
        $recentApplications = Application::with('career')
            ->latest()
            ->limit(5)
            ->get();

        $upcomingInterviews = Application::with('career')
            ->where('application_status', 'Interview Scheduled')
            ->where('interview_date', '>=', now())
            ->orderBy('interview_date')
            ->limit(5)
            ->get();

        $newEmployees = Employee::latest()
            ->limit(5)
            ->get();

        $leaveRequests = LeaveRequest::with('employee')
            ->where('status', 'Pending')
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'metrics' => [
                    'total_employees' => $totalEmployees,
                    'active_employees' => $activeEmployees,
                    'open_positions' => $openPositions,
                    'applications_this_month' => $applicationsThisMonth,
                    'pending_interviews' => $pendingInterviews,
                    'approved_leaves' => $approvedLeaves,
                ],
                'charts' => [
                    'hiring_trend' => $hiringTrend,
                    'department_distribution' => $departmentData,
                    'attendance_summary' => $attendanceData,
                    'leave_statistics' => $leaveData,
                ],
                'recent_activity' => [
                    'latest_applications' => $recentApplications,
                    'upcoming_interviews' => $upcomingInterviews,
                    'new_employees' => $newEmployees,
                    'leave_requests' => $leaveRequests,
                ],
            ],
        ]);
    }
}
