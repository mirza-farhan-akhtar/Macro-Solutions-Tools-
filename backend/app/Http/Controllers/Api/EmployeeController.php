<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::query();

        // Filter by department
        if ($request->has('department') && $request->department) {
            $query->where('department', $request->department);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Search by name or email
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }

        $employees = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $employees,
        ]);
    }

    public function show($id)
    {
        $employee = Employee::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $employee,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string',
            'email' => 'required|email|unique:employees',
            'phone' => 'required|string',
            'department' => 'required|string',
            'designation' => 'required|string',
            'joining_date' => 'required|date',
            'employment_type' => 'required|in:Full-time,Part-time,Contract,Temporary',
            'salary' => 'nullable|numeric',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'emergency_contact' => 'nullable|string',
            'emergency_contact_phone' => 'nullable|string',
        ]);

        // Find the department by name or code
        $department = Department::where('name', $validated['department'])
            ->orWhere('code', $validated['department'])
            ->first();

        if (!$department) {
            return response()->json([
                'success' => false,
                'message' => 'Department not found. Please select a valid department.'
            ], 422);
        }

        // Create or link a user account
        $user = User::where('email', $validated['email'])->first();
        if (!$user) {
            $user = User::create([
                'name'          => $validated['full_name'],
                'email'         => $validated['email'],
                'password'      => bcrypt('password'),
                'department_id' => $department->id,
            ]);
        } else {
            // If user exists but doesn't have a department, assign it
            if (!$user->department_id) {
                $user->update(['department_id' => $department->id]);
            }
        }

        // Generate unique employee ID
        $lastEmployee = Employee::orderBy('employee_id', 'desc')->first();
        $lastNumber = $lastEmployee ? (int)substr($lastEmployee->employee_id, 4) : 0;
        $validated['employee_id'] = 'EMP-' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        $validated['user_id'] = $user->id;

        $employee = Employee::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Employee created successfully',
            'data' => $employee,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        $validated = $request->validate([
            'full_name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:employees,email,' . $id,
            'phone' => 'sometimes|string',
            'department' => 'sometimes|string',
            'designation' => 'sometimes|string',
            'employment_type' => 'sometimes|in:Full-time,Part-time,Contract,Temporary',
            'salary' => 'nullable|numeric',
            'status' => 'sometimes|in:Active,Resigned,Terminated,On Leave',
            'address' => 'nullable|string',
            'work_start_time' => 'nullable|date_format:H:i',
            'work_end_time'   => 'nullable|date_format:H:i',
        ]);

        $employee->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Employee updated successfully',
            'data' => $employee,
        ]);
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();

        return response()->json([
            'success' => true,
            'message' => 'Employee deleted successfully',
        ]);
    }
}
