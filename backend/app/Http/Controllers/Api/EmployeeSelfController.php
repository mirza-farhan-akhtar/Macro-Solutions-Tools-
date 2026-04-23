<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\LeaveQuotaController;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\Meeting;
use Illuminate\Http\Request;

class EmployeeSelfController extends Controller
{
    /** Helper â€” resolve the authenticated user's Employee record. */
    private function resolveEmployee()
    {
        return Employee::where('user_id', auth()->id())->first();
    }

    // â”€â”€â”€ Profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public function me()
    {
        $employee = $this->resolveEmployee();

        if (! $employee) {
            return response()->json(['success' => false, 'message' => 'No employee record linked to your account.'], 404);
        }

        return response()->json(['success' => true, 'data' => $employee]);
    }

    // â”€â”€â”€ Attendance â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /** Return own attendance records filtered by month. */
    public function myAttendance(Request $request)
    {
        $employee = $this->resolveEmployee();
        if (! $employee) {
            return response()->json(['success' => false, 'message' => 'No employee record linked to your account.'], 404);
        }

        $month = $request->get('month', now()->format('Y-m'));

        $records = Attendance::where('employee_id', $employee->id)
            ->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$month])
            ->orderBy('date', 'desc')
            ->get();

        $summary = [
            'present'  => $records->where('status', 'Present')->count(),
            'absent'   => $records->where('status', 'Absent')->count(),
            'late'     => $records->where('status', 'Late')->count(),
            'leave'    => $records->where('status', 'Leave')->count(),
            'half_day' => $records->where('status', 'Half Day')->count(),
        ];

        // Check today's record
        $today = Attendance::where('employee_id', $employee->id)
            ->where('date', now()->toDateString())
            ->first();

        return response()->json([
            'success' => true,
            'data'    => [
                'records' => $records,
                'summary' => $summary,
                'today'   => $today,
            ],
        ]);
    }

    /** Mark check-in for today. */
    public function checkIn(Request $request)
    {
        $employee = $this->resolveEmployee();
        if (! $employee) {
            return response()->json(['success' => false, 'message' => 'No employee record linked to your account.'], 404);
        }

        $today = now()->toDateString();

        // Prevent duplicate check-in
        $existing = Attendance::where('employee_id', $employee->id)->where('date', $today)->first();
        if ($existing) {
            return response()->json(['success' => false, 'message' => 'You have already checked in today.'], 422);
        }

        $checkInTime = now()->format('H:i');
        // Use employee's work_start_time (default 09:30) for late detection
        $workStart = $employee->work_start_time ?? '09:30';
        $workStartHHMM = substr($workStart, 0, 5);
        $status = ($checkInTime > $workStartHHMM) ? 'Late' : 'Present';

        $attendance = Attendance::create([
            'employee_id' => $employee->id,
            'date'        => $today,
            'check_in'    => $checkInTime,
            'status'      => $status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Checked in successfully at ' . $checkInTime,
            'data'    => $attendance,
        ]);
    }

    /** Mark check-out for today's attendance record. */
    public function checkOut(Request $request)
    {
        $employee = $this->resolveEmployee();
        if (! $employee) {
            return response()->json(['success' => false, 'message' => 'No employee record linked to your account.'], 404);
        }

        $today = now()->toDateString();
        $attendance = Attendance::where('employee_id', $employee->id)->where('date', $today)->first();

        if (! $attendance) {
            return response()->json(['success' => false, 'message' => 'No check-in found for today. Please check in first.'], 422);
        }

        if ($attendance->check_out) {
            return response()->json(['success' => false, 'message' => 'You have already checked out today.'], 422);
        }

        $checkOutTime = now()->format('H:i');
        $attendance->update(['check_out' => $checkOutTime]);

        return response()->json([
            'success' => true,
            'message' => 'Checked out successfully at ' . $checkOutTime,
            'data'    => $attendance,
        ]);
    }

    // â”€â”€â”€ Leaves â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave'];

    /** Return own leave requests. */
    public function myLeaves(Request $request)
    {
        $employee = $this->resolveEmployee();
        if (! $employee) {
            return response()->json(['success' => false, 'message' => 'No employee record linked to your account.'], 404);
        }

        $leaves = LeaveRequest::where('employee_id', $employee->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['success' => true, 'data' => $leaves]);
    }

    /** Return leave balance per type for current year. */
    public function leaveBalance()
    {
        $employee = $this->resolveEmployee();
        if (! $employee) {
            return response()->json(['success' => false, 'message' => 'No employee record linked to your account.'], 404);
        }

        $year = now()->year;
        $balance = [];

        foreach (self::LEAVE_TYPES as $type) {
            $quota = LeaveQuotaController::getEffectiveQuota($employee->id, $type, $year);
            $used = LeaveRequest::where('employee_id', $employee->id)
                ->where('leave_type', $type)
                ->where('status', 'Approved')
                ->whereYear('start_date', $year)
                ->sum('total_days');

            $balance[] = [
                'leave_type' => $type,
                'quota'      => $quota,
                'used'       => (int) $used,
                'remaining'  => max(0, $quota - (int) $used),
            ];
        }

        return response()->json(['success' => true, 'data' => $balance]);
    }

    /** Submit a leave request for self. */
    public function applyLeave(Request $request)
    {
        $employee = $this->resolveEmployee();
        if (! $employee) {
            return response()->json(['success' => false, 'message' => 'No employee record linked to your account.'], 404);
        }

        $validated = $request->validate([
            'leave_type' => 'required|in:Sick Leave,Casual Leave,Annual Leave,Maternity Leave,Paternity Leave',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date'   => 'required|date|after_or_equal:start_date',
            'reason'     => 'required|string|min:5',
        ]);

        // Calculate days
        $start = new \DateTime($validated['start_date']);
        $end   = new \DateTime($validated['end_date']);
        $days  = $start->diff($end)->days + 1;

        // Check quota (per-employee or system default)
        $year = now()->year;
        $quota = LeaveQuotaController::getEffectiveQuota($employee->id, $validated['leave_type'], $year);
        $used  = LeaveRequest::where('employee_id', $employee->id)
            ->where('leave_type', $validated['leave_type'])
            ->where('status', 'Approved')
            ->whereYear('start_date', $year)
            ->sum('total_days');

        if (($used + $days) > $quota) {
            return response()->json([
                'success' => false,
                'message' => "Insufficient leave balance. You only have " . max(0, $quota - $used) . " days remaining for {$validated['leave_type']}.",
            ], 422);
        }

        $leave = LeaveRequest::create([
            'employee_id' => $employee->id,
            'leave_type'  => $validated['leave_type'],
            'start_date'  => $validated['start_date'],
            'end_date'    => $validated['end_date'],
            'total_days'  => $days,
            'reason'      => $validated['reason'],
            'status'      => 'Pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Leave request submitted successfully. Pending HR approval.',
            'data'    => $leave,
        ], 201);
    }

    // â”€â”€â”€ Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public function dashboard()
    {
        $user     = auth()->user();
        $employee = $this->resolveEmployee();
        $month    = now()->format('Y-m');

        $presentCount = $employee
            ? Attendance::where('employee_id', $employee->id)
                        ->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$month])
                        ->whereIn('status', ['Present', 'Late'])
                        ->count()
            : 0;

        $pendingLeaves = $employee
            ? LeaveRequest::where('employee_id', $employee->id)
                          ->where('status', 'Pending')
                          ->count()
            : 0;

        $upcomingMeetings = Meeting::where(function ($q) use ($user) {
                $q->where('organizer_id', $user->id)
                  ->orWhereJsonContains('attendee_user_ids', $user->id);
            })
            ->where('meeting_date', '>=', now()->toDateString())
            ->where('meeting_date', '<=', now()->addDays(7)->toDateString())
            ->where('status', 'Scheduled')
            ->count();

        $today = $employee
            ? Attendance::where('employee_id', $employee->id)
                        ->where('date', now()->toDateString())
                        ->first()
            : null;

        return response()->json([
            'success' => true,
            'data'    => [
                'user'              => ['name' => $user->name, 'email' => $user->email],
                'employee'          => $employee,
                'present_this_month'    => $presentCount,
                'pending_leaves'        => $pendingLeaves,
                'upcoming_meetings'     => $upcomingMeetings,
                'today_attendance'      => $today,
            ],
        ]);
    }
}
