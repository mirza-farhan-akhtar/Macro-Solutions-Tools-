<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\LeaveQuotaController;
use App\Models\LeaveRequest;
use App\Models\Employee;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = LeaveRequest::with(['employee', 'approver']);

        // Filter by employee
        if ($request->has('employee_id') && $request->employee_id) {
            $query->where('employee_id', $request->employee_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by leave type
        if ($request->has('leave_type') && $request->leave_type) {
            $query->where('leave_type', $request->leave_type);
        }

        $requests = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $requests,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'leave_type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
        ]);

        // Calculate total days
        $startDate = new \DateTime($validated['start_date']);
        $endDate = new \DateTime($validated['end_date']);
        $interval = $startDate->diff($endDate);
        $validated['total_days'] = $interval->days + 1;
        $validated['status'] = 'Pending';

        $leaveRequest = LeaveRequest::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Leave request submitted successfully',
            'data' => $leaveRequest,
        ], 201);
    }

    public function approve(Request $request, $id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);

        $validated = $request->validate([
            'approval_notes' => 'nullable|string',
        ]);

        $leaveRequest->update([
            'status' => 'Approved',
            'approved_by' => auth()->id(),
            'approved_date' => now(),
            'approval_notes' => $validated['approval_notes'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Leave request approved',
            'data' => $leaveRequest,
        ]);
    }

    public function reject(Request $request, $id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);

        $validated = $request->validate([
            'approval_notes' => 'required|string',
        ]);

        $leaveRequest->update([
            'status' => 'Rejected',
            'approved_by' => auth()->id(),
            'approved_date' => now(),
            'approval_notes' => $validated['approval_notes'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Leave request rejected',
            'data' => $leaveRequest,
        ]);
    }

    public function getEmployeeLeaveBalance($employeeId)
    {
        $employee = Employee::findOrFail($employeeId);

        $leaveTypes = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave'];
        $year    = now()->year;
        $balance = [];

        foreach ($leaveTypes as $type) {
            $quota = LeaveQuotaController::getEffectiveQuota((int)$employeeId, $type, $year);
            $used  = LeaveRequest::where('employee_id', $employeeId)
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

        return response()->json([
            'success' => true,
            'data'    => [
                'employee' => $employee,
                'year'     => $year,
                'balance'  => $balance,
            ],
        ]);
    }
}
