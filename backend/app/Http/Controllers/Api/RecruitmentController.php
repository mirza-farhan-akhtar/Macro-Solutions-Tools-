<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Career;
use App\Models\Application;
use App\Models\Department;
use Illuminate\Http\Request;

class RecruitmentController extends Controller
{
    // Job Posts
    public function getJobPosts(Request $request)
    {
        $query = Career::query();

        if ($request->has('status') && $request->status) {
            $query->where('hiring_status', $request->status);
        }

        if ($request->has('department') && $request->department) {
            $query->where('department', $request->department);
        }

        if ($request->has('search') && $request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $posts = $query->withCount('applications')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $posts,
        ]);
    }

    public function createJobPost(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'department' => 'required|string|max:100',
            'location' => 'nullable|string|max:100',
            'employment_type' => 'nullable|in:Full-time,Part-time,Contract,Temporary',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'required_experience' => 'nullable|string',
            'hiring_status' => 'nullable|in:Open,Closed,On Hold',
        ]);

        $validated['hiring_status'] = $validated['hiring_status'] ?? 'Open';
        // Sync the public 'status' field so jobs appear on the careers page
        $validated['status'] = 'open';
        // Remove non-fillable fields
        unset($validated['required_experience']);

        $career = Career::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Job post created successfully',
            'data' => $career,
        ], 201);
    }

    public function deleteJobPost($id)
    {
        $career = Career::findOrFail($id);
        $career->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job post deleted successfully',
        ]);
    }

    public function updateJobPost(Request $request, $id)
    {
        $career = Career::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'department' => 'sometimes|string',
            'employment_type' => 'sometimes|in:Full-time,Part-time,Contract,Temporary',
            'salary_min' => 'nullable|numeric',
            'salary_max' => 'nullable|numeric',
            'hiring_status' => 'sometimes|in:Open,Closed,On Hold',
        ]);

        // Keep public 'status' in sync with hiring_status
        if (isset($validated['hiring_status'])) {
            $validated['status'] = $validated['hiring_status'] === 'Open' ? 'open' : 'closed';
        }

        $career->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Job post updated successfully',
            'data' => $career,
        ]);
    }

    // Applications
    public function getApplications(Request $request)
    {
        $query = Application::with(['career', 'assignedTo']);

        if ($request->has('status') && $request->status) {
            $query->where('application_status', $request->status);
        }

        if ($request->has('career_id') && $request->career_id) {
            $query->where('career_id', $request->career_id);
        }

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('applicant_name', 'like', '%' . $request->search . '%')
                  ->orWhere('applicant_email', 'like', '%' . $request->search . '%');
            });
        }

        $applications = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $applications,
        ]);
    }

    public function updateApplicationStatus(Request $request, $id)
    {
        $application = Application::findOrFail($id);

        $validated = $request->validate([
            'application_status' => 'required|in:Applied,Shortlisted,Interview Scheduled,Rejected,Hired',
            'internal_notes' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $application->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Application status updated successfully',
            'data' => $application,
        ]);
    }

    public function hireApplicant(Request $request, $id)
    {
        $application = Application::findOrFail($id);

        $validated = $request->validate([
            'full_name'       => 'required|string',
            'email'           => 'required|email',
            'phone'           => 'required|string',
            'department'      => 'required|string',
            'designation'     => 'required|string',
            'joining_date'    => 'required|date',
            'employment_type' => 'required|in:Full-time,Part-time,Contract,Temporary',
            'salary'          => 'nullable|numeric',
            'role_id'         => 'nullable|exists:roles,id',
            'temp_password'   => 'nullable|string|min:6',
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

        // --- Create or link a user account ---
        $plainPassword = ! empty($validated['temp_password']) ? $validated['temp_password'] : 'password';
        $user = \App\Models\User::where('email', $validated['email'])->first();
        if (! $user) {
            $user = \App\Models\User::create([
                'name'          => $validated['full_name'],
                'email'         => $validated['email'],
                'password'      => bcrypt($plainPassword),
                'department_id' => $department->id,
            ]);
        } else {
            // If user exists, make sure they have the department assigned
            $user->update(['department_id' => $department->id]);
        }

        // Assign role if specified
        if (! empty($validated['role_id'])) {
            $role = \App\Models\Role::find($validated['role_id']);
            if ($role) {
                $user->syncRoles([$role->id]);
            }
        }

        // --- Create the employee record (check uniqueness against employee table) ---
        if (\App\Models\Employee::where('email', $validated['email'])->exists()) {
            return response()->json(['success' => false, 'message' => 'An employee with this email already exists.'], 422);
        }

        $lastEmployee = \App\Models\Employee::orderBy('employee_id', 'desc')->first();
        $lastNumber   = $lastEmployee ? (int) substr($lastEmployee->employee_id, 4) : 0;

        $employee = \App\Models\Employee::create([
            'employee_id'     => 'EMP-' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT),
            'user_id'         => $user->id,
            'full_name'       => $validated['full_name'],
            'email'           => $validated['email'],
            'phone'           => $validated['phone'],
            'department'      => $validated['department'],
            'designation'     => $validated['designation'],
            'joining_date'    => $validated['joining_date'],
            'employment_type' => $validated['employment_type'],
            'salary'          => $validated['salary'] ?? null,
            'status'          => 'Active',
        ]);

        // Update application status
        $application->update(['application_status' => 'Hired']);

        return response()->json([
            'success' => true,
            'message' => 'Employee created successfully. Login: ' . $validated['email'] . ' / ' . $plainPassword . ' (please have them change it)',
            'data'    => [
                'employee'    => $employee,
                'user_id'     => $user->id,
                'application' => $application,
            ],
        ], 201);
    }

    public function getRecruitmentStats()
    {
        $stats = [
            'total_jobs' => Career::count(),
            'open_jobs' => Career::where('hiring_status', 'Open')->count(),
            'closed_jobs' => Career::where('hiring_status', 'Closed')->count(),
            'total_applications' => Application::count(),
            'applied' => Application::where('application_status', 'Applied')->count(),
            'shortlisted' => Application::where('application_status', 'Shortlisted')->count(),
            'interviews_scheduled' => Application::where('application_status', 'Interview Scheduled')->count(),
            'rejected' => Application::where('application_status', 'Rejected')->count(),
            'hired' => Application::where('application_status', 'Hired')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
