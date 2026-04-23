<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\LeaveQuota;
use Illuminate\Http\Request;

class LeaveQuotaController extends Controller
{
    private const DEFAULT_QUOTAS = [
        'Sick Leave'      => 12,
        'Casual Leave'    => 15,
        'Annual Leave'    => 21,
        'Maternity Leave' => 90,
        'Paternity Leave' => 15,
    ];

    /**
     * GET /admin/hr/leave-quotas?employee_id=X&year=2026
     * Returns per-type quotas for an employee (merged with defaults).
     */
    public function show(Request $request)
    {
        $employeeId = $request->get('employee_id');
        $year       = $request->get('year', date('Y'));

        $employee = Employee::findOrFail($employeeId);
        $saved    = LeaveQuota::where('employee_id', $employeeId)
                              ->where('year', $year)
                              ->get()
                              ->keyBy('leave_type');

        $result = [];
        foreach (self::DEFAULT_QUOTAS as $type => $default) {
            $result[] = [
                'leave_type' => $type,
                'quota'      => $saved->has($type) ? (int) $saved[$type]->quota : $default,
                'is_custom'  => $saved->has($type),
            ];
        }

        return response()->json([
            'success'  => true,
            'employee' => $employee->full_name,
            'year'     => $year,
            'data'     => $result,
        ]);
    }

    /**
     * POST /admin/hr/leave-quotas
     * Body: { employee_id, year, quotas: [{leave_type, quota}] }
     */
    public function update(Request $request)
    {
        $request->validate([
            'employee_id'          => 'required|exists:employees,id',
            'year'                 => 'required|integer|min:2020|max:2100',
            'quotas'               => 'required|array',
            'quotas.*.leave_type'  => 'required|string',
            'quotas.*.quota'       => 'required|integer|min:0',
        ]);

        $employeeId = $request->employee_id;
        $year       = $request->year;

        foreach ($request->quotas as $q) {
            LeaveQuota::updateOrCreate(
                [
                    'employee_id' => $employeeId,
                    'leave_type'  => $q['leave_type'],
                    'year'        => $year,
                ],
                ['quota' => $q['quota']]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Leave quotas updated successfully',
        ]);
    }

    /**
     * GET /admin/hr/leave-quotas/all?year=2026
     * Returns all employees' leave quotas (summary view).
     */
    public function index(Request $request)
    {
        $year      = $request->get('year', date('Y'));
        $employees = Employee::where('status', 'Active')->get();

        $quotas = LeaveQuota::where('year', $year)->get()->groupBy('employee_id');

        $result = $employees->map(function ($emp) use ($quotas) {
            $empQuotas = $quotas->get($emp->id, collect());
            $perType   = [];
            foreach (self::DEFAULT_QUOTAS as $type => $default) {
                $row         = $empQuotas->firstWhere('leave_type', $type);
                $perType[]   = [
                    'leave_type' => $type,
                    'quota'      => $row ? (int)$row->quota : $default,
                    'is_custom'  => (bool)$row,
                ];
            }
            return [
                'id'          => $emp->id,
                'employee_id' => $emp->employee_id,
                'full_name'   => $emp->full_name,
                'department'  => $emp->department,
                'quotas'      => $perType,
            ];
        });

        return response()->json(['success' => true, 'data' => $result]);
    }

    /**
     * DELETE /admin/hr/leave-quotas  -- reset to defaults
     * Body: { employee_id, year }
     */
    public function reset(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'year'        => 'required|integer',
        ]);

        LeaveQuota::where('employee_id', $request->employee_id)
                  ->where('year', $request->year)
                  ->delete();

        return response()->json(['success' => true, 'message' => 'Quotas reset to defaults']);
    }

    /**
     * Static helper for other controllers to get effective quota.
     */
    public static function getEffectiveQuota(int $employeeId, string $leaveType, int $year): int
    {
        $row = LeaveQuota::where('employee_id', $employeeId)
                         ->where('leave_type', $leaveType)
                         ->where('year', $year)
                         ->first();

        return $row ? (int)$row->quota : (self::DEFAULT_QUOTAS[$leaveType] ?? 0);
    }
}
