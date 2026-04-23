<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with('employee');

        // Filter by employee
        if ($request->has('employee_id') && $request->employee_id) {
            $query->where('employee_id', $request->employee_id);
        }

        // Filter by department
        if ($request->has('department') && $request->department) {
            $query->whereHas('employee', fn($q) => $q->where('department', $request->department));
        }

        // Filter by month
        if ($request->has('month') && $request->month) {
            $month = $request->month; // Format: YYYY-MM
            $query->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$month]);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $records = $query->orderBy('date', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $records,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i',
            'status' => 'required|in:Present,Absent,Late,Leave,Holiday,Half Day',
            'notes' => 'nullable|string',
        ]);

        $attendance = Attendance::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Attendance recorded successfully',
            'data' => $attendance,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);

        $validated = $request->validate([
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i',
            'status' => 'sometimes|in:Present,Absent,Late,Leave,Holiday,Half Day',
            'notes' => 'nullable|string',
        ]);

        $attendance->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Attendance updated successfully',
            'data' => $attendance,
        ]);
    }

    public function getMonthlyAttendance($employeeId, $month)
    {
        $records = Attendance::where('employee_id', $employeeId)
            ->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$month])
            ->orderBy('date')
            ->get();

        $summary = [
            'present' => $records->where('status', 'Present')->count(),
            'absent' => $records->where('status', 'Absent')->count(),
            'late' => $records->where('status', 'Late')->count(),
            'leave' => $records->where('status', 'Leave')->count(),
            'holiday' => $records->where('status', 'Holiday')->count(),
            'half_day' => $records->where('status', 'Half Day')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'records' => $records,
                'summary' => $summary,
            ],
        ]);
    }
}
