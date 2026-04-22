<?php

namespace App\Http\Controllers\Api;

use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class DepartmentController extends BaseController
{
    /**
     * Get all departments with optional filtering.
     */
    public function index(Request $request)
    {
        $this->authorizeAtLeast(['department.view', 'hr.view']);

        $query = Department::with(['head', 'parent', 'employees', 'children']);

        // Filter by search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%");
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by parent (only root departments if requested)
        if ($request->has('root') && $request->root == 'true') {
            $query->whereNull('parent_id');
        }

        $perPage = $request->input('per_page', 15);
        $departments = $query->paginate($perPage);

        return $this->respondWithPagination($departments);
    }

    /**
     * Get a single department with all details.
     */
    public function show(Department $department)
    {
        $department->load([
            'head', 
            'parent', 
            'children', 
            'employees' => function ($query) {
                $query->where('status', 'active');
            }
        ]);

        $this->authorize('view', $department);

        $stats = $department->getStats();

        return $this->respond([
            'data' => $department,
            'stats' => $stats,
        ]);
    }

    /**
     * Create a new department.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Department::class);

        try {
            $validated = $request->validate([
                'name' => 'required|string|unique:departments|max:100',
                'code' => 'required|string|unique:departments|max:20',
                'description' => 'nullable|string|max:500',
                'head_id' => 'nullable|exists:users,id',
                'parent_id' => 'nullable|exists:departments,id',
                'status' => 'required|in:Active,Inactive',
            ]);

            $department = Department::create($validated);
            $department->load('head', 'parent');

            return $this->respond([
                'data' => $department
            ], 'Department created successfully', 201);
        } catch (ValidationException $e) {
            return $this->respondError($e->errors(), 'Validation failed', 422);
        }
    }

    /**
     * Update a department.
     */
    public function update(Request $request, Department $department)
    {
        $this->authorize('update', $department);

        try {
            $validated = $request->validate([
                'name' => 'required|string|unique:departments,name,' . $department->id . '|max:100',
                'code' => 'required|string|unique:departments,code,' . $department->id . '|max:20',
                'description' => 'nullable|string|max:500',
                'head_id' => 'nullable|exists:users,id',
                'parent_id' => 'nullable|exists:departments,id|different:id',
                'status' => 'required|in:Active,Inactive',
            ]);

            // Prevent circular hierarchy
            if (isset($validated['parent_id']) && $this->wouldCreateCircularHierarchy($department->id, $validated['parent_id'])) {
                throw ValidationException::withMessages([
                    'parent_id' => ['Cannot set parent department to a child department.']
                ]);
            }

            $department->update($validated);
            $department->load('head', 'parent');

            return $this->respond([
                'data' => $department
            ], 'Department updated successfully');
        } catch (ValidationException $e) {
            return $this->respondError($e->errors(), 'Validation failed', 422);
        }
    }

    /**
     * Delete a department.
     */
    public function destroy(Department $department)
    {
        $this->authorize('delete', $department);

        // Check if department has employees assigned
        if ($department->employees()->count() > 0) {
            return $this->respondError([
                'employees' => 'Cannot delete department with assigned employees'
            ], 'Validation failed', 422);
        }

        $department->delete();

        return $this->respond(null, 'Department deleted successfully');
    }

    /**
     * Assign users to department.
     */
    public function assignUsers(Request $request, Department $department)
    {
        $this->authorize('assignUsers');

        try {
            $validated = $request->validate([
                'user_ids' => 'required|array',
                'user_ids.*' => 'exists:users,id',
            ]);

            User::whereIn('id', $validated['user_ids'])->update([
                'department_id' => $department->id
            ]);

            $department->load('employees');

            return $this->respond([
                'data' => $department
            ], 'Users assigned to department successfully');
        } catch (ValidationException $e) {
            return $this->respondError($e->errors(), 'Validation failed', 422);
        }
    }

    /**
     * Remove user from department.
     */
    public function removeUser(Request $request, Department $department)
    {
        $this->authorize('assignUsers');

        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
            ]);

            User::where('id', $validated['user_id'])
                ->where('department_id', $department->id)
                ->update(['department_id' => null]);

            $department->load('employees');

            return $this->respond([
                'data' => $department
            ], 'User removed from department successfully');
        } catch (ValidationException $e) {
            return $this->respondError($e->errors(), 'Validation failed', 422);
        }
    }

    /**
     * Get department employees.
     */
    public function employees(Department $department)
    {
        // $department is already resolved by implicit binding
        $this->authorize('view', $department);

        $employees = $department->employees()->with('roles')->paginate(20);

        return $this->respondWithPagination($employees);
    }

    /**
     * Get department hierarchy/tree.
     */
    public function tree()
    {
        $this->authorize('viewAny', Department::class);

        $departments = Department::with('children', 'head')
            ->whereNull('parent_id')
            ->get()
            ->map(fn($dept) => $this->buildDepartmentTree($dept));

        return $this->respond([
            'data' => $departments
        ]);
    }

    /**
     * Build department tree recursively.
     */
    private function buildDepartmentTree(Department $department)
    {
        return [
            'id' => $department->id,
            'name' => $department->name,
            'code' => $department->code,
            'head' => $department->head ? [
                'id' => $department->head->id,
                'name' => $department->head->name,
            ] : null,
            'employee_count' => $department->employees()->count(),
            'children' => $department->children->map(fn($child) => $this->buildDepartmentTree($child)),
        ];
    }

    /**
     * Check if setting parent_id would create a circular hierarchy.
     */
    private function wouldCreateCircularHierarchy($departmentId, $parentId): bool
    {
        if ($departmentId === $parentId) {
            return true;
        }

        $parent = Department::find($parentId);
        while ($parent) {
            if ($parent->id === $departmentId) {
                return true;
            }
            $parent = $parent->parent;
        }

        return false;
    }

    /**
     * Get projects for a department.
     */
    public function projects(Department $department)
    {
        $this->authorize('view', $department);

        // Primary projects owned by this department
        $primaryProjects = \App\Models\Project::where('primary_department_id', $department->id)
            ->with('creator', 'departments')
            ->get()
            ->each(fn($p) => $p->project_type = 'primary');

        // Participating projects (via pivot) that are not primary to this department
        $participatingProjects = \App\Models\Project::whereHas('departments', function ($query) use ($department) {
                $query->where('department_id', $department->id);
            })
            ->where(function ($query) use ($department) {
                $query->where('primary_department_id', '!=', $department->id)
                      ->orWhereNull('primary_department_id');
            })
            ->with('creator', 'departments')
            ->get()
            ->each(fn($p) => $p->project_type = 'participating');

        $projects = $primaryProjects->concat($participatingProjects);

        return $this->respond([
            'data' => $projects
        ]);
    }

    /**
     * Get tasks for a department (via its projects).
     */
    public function tasks(Department $department)
    {
        $this->authorize('view', $department);

        $projectIds = \App\Models\Project::where('primary_department_id', $department->id)
            ->pluck('id');

        $tasks = \App\Models\ProjectTask::whereIn('project_id', $projectIds)
            ->with('project:id,name,code', 'assignedUser:id,name,email')
            ->get();

        return $this->respond([
            'data' => $tasks
        ]);
    }

    /**
     * Get meetings for a department.
     */
    public function meetings(Department $department)
    {
        $this->authorize('view', $department);

        // Meetings can be associated via employees of the department
        $employeeIds = $department->employees()->pluck('users.id');

        $meetings = \App\Models\Meeting::where(function ($query) use ($employeeIds) {
            // Meetings where organizer is from department
            $query->whereIn('organizer_id', $employeeIds);
        })
        ->with('organizer')
        ->get();

        return $this->respond([
            'data' => $meetings
        ]);
    }

    /**
     * Get analytics for a department.
     */
    public function analytics(Department $department)
    {
        $this->authorize('view', $department);

        $projectIds = \App\Models\Project::where('primary_department_id', $department->id)->pluck('id');

        $analytics = [
            'total_projects' => $projectIds->count(),
            'total_tasks' => \App\Models\ProjectTask::whereIn('project_id', $projectIds)->count(),
            'completed_projects' => \App\Models\Project::where('primary_department_id', $department->id)
                ->where('status', 'Completed')->count(),
            'completed_tasks' => \App\Models\ProjectTask::whereIn('project_id', $projectIds)
                ->where('status', 'Completed')->count(),
            'total_employees' => $department->employees()->count(),
            'active_employees' => $department->employees()->where('status', 'active')->count(),
            'total_meetings' => \App\Models\Meeting::whereIn('organizer_id', $department->employees()->pluck('users.id'))->count(),
            'project_budget_total' => \App\Models\Project::where('primary_department_id', $department->id)->sum('budget') ?? 0,
            'project_spent' => \App\Models\Project::where('primary_department_id', $department->id)->sum('actual_cost') ?? 0,
        ];

        return $this->respond([
            'data' => $analytics
        ]);
    }

    /**
     * Get timeline/milestones for a department.
     */
    public function timeline(Department $department)
    {
        $this->authorize('view', $department);

        $projects = \App\Models\Project::where('primary_department_id', $department->id)
            ->with('tasks')
            ->get();

        $events = [];
        foreach ($projects as $project) {
            if ($project->start_date) {
                $events[] = [
                    'id' => 'project-' . $project->id,
                    'title' => $project->name . ' (Start)',
                    'date' => $project->start_date,
                    'type' => 'project_start',
                    'project_id' => $project->id,
                    'status' => $project->status,
                ];
            }
            if ($project->end_date) {
                $events[] = [
                    'id' => 'project-end-' . $project->id,
                    'title' => $project->name . ' (End)',
                    'date' => $project->end_date,
                    'type' => 'project_end',
                    'project_id' => $project->id,
                    'status' => $project->status,
                ];
            }
        }

        usort($events, function ($a, $b) {
            return strtotime($a['date']) - strtotime($b['date']);
        });

        return $this->respond([
            'data' => $events
        ]);
    }

    /**
     * Get budget/financial overview for a department.
     */
    public function budget(Department $department)
    {
        $this->authorize('view', $department);

        $projects = \App\Models\Project::where('primary_department_id', $department->id)->get();

        $budgetData = [
            'total_budget' => $projects->sum('budget') ?? 0,
            'total_spent' => $projects->sum('actual_cost') ?? 0,
            'remaining_budget' => ($projects->sum('budget') ?? 0) - ($projects->sum('actual_cost') ?? 0),
            'projects' => $projects->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'budget' => $project->budget,
                    'spent' => $project->actual_cost,
                    'remaining' => ($project->budget ?? 0) - ($project->actual_cost ?? 0),
                    'status' => $project->status,
                ];
            }),
        ];

        return $this->respond([
            'data' => $budgetData
        ]);
    }

    /**
     * Get incoming project requests for a department.
     */
    public function projectRequests(Department $department)
    {
        $this->authorize('view', $department);

        $requests = \App\Models\DepartmentProjectRequest::where('target_department_id', $department->id)
            ->with('project', 'requestingDepartment', 'requester', 'targetUser')
            ->get();

        return $this->respond([
            'data' => $requests
        ]);
    }

    /**
     * Get sent project requests from a department.
     */
    public function projectRequestsSent(Department $department)
    {
        $this->authorize('view', $department);

        $requests = \App\Models\DepartmentProjectRequest::where('requesting_department_id', $department->id)
            ->with('project', 'targetDepartment', 'requester', 'targetUser')
            ->get();

        return $this->respond([
            'data' => $requests
        ]);
    }

    /**
     * Create a project within a department.
     */
    public function storeProject(Request $request, Department $department)
    {
        $this->authorize('create', \App\Models\Project::class);

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|unique:projects|max:50',
                'description' => 'nullable|string',
                'status' => 'required|in:Planning,In Progress,On Hold,Completed',
                'priority' => 'nullable|in:Low,Medium,High,Critical',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'budget' => 'nullable|numeric|min:0',
                'assigned_employees' => 'nullable|array',
                'assigned_employees.*' => 'exists:users,id',
            ]);

            $project = \App\Models\Project::create([
                'name' => $validated['name'],
                'code' => $validated['code'],
                'description' => $validated['description'] ?? null,
                'status' => $validated['status'],
                'priority' => $validated['priority'] ?? 'Medium',
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'budget' => $validated['budget'] ?? 0,
                'primary_department_id' => $department->id,
                'created_by' => auth()->id(),
                'progress' => 0,
            ]);

            // Assign employees to the project
            if (!empty($validated['assigned_employees'])) {
                foreach ($validated['assigned_employees'] as $userId) {
                    $project->members()->attach($userId, [
                        'role_in_project' => 'Team Member',
                        'is_lead' => false,
                        'status' => 'Active',
                        'joined_at' => now(),
                    ]);
                }
            }

            $project->load('creator', 'members');

            return $this->respond([
                'data' => $project
            ], 'Project created successfully', 201);
        } catch (ValidationException $e) {
            return $this->respondError($e->errors(), 'Validation failed', 422);
        }
    }

    /**
     * Approve a project request.
     */
    public function approveProjectRequest(Request $request, Department $department, $requestId)
    {
        $this->authorize('edit', $department);

        $projectRequest = \App\Models\DepartmentProjectRequest::findOrFail($requestId);

        if ($projectRequest->target_department_id != $department->id) {
            return $this->respondError([], 'Unauthorized', 403);
        }

        try {
            $validated = $request->validate([
                'target_user_id' => 'required|exists:users,id',
                'response_message' => 'nullable|string|max:500',
            ]);

            $projectRequest->targetUser()->associate($validated['target_user_id']);
            $projectRequest->approve(auth()->id(), $validated['response_message'] ?? null);

            return $this->respond([
                'data' => $projectRequest->fresh()->load('project', 'requester', 'targetUser', 'targetDepartment')
            ], 'Project request approved', 200);
        } catch (ValidationException $e) {
            return $this->respondError($e->errors(), 'Validation failed', 422);
        }
    }

    /**
     * Reject a project request.
     */
    public function rejectProjectRequest(Request $request, Department $department, $requestId)
    {
        $this->authorize('edit', $department);

        $projectRequest = \App\Models\DepartmentProjectRequest::findOrFail($requestId);

        if ($projectRequest->target_department_id != $department->id) {
            return $this->respondError([], 'Unauthorized', 403);
        }

        try {
            $validated = $request->validate([
                'response_message' => 'required|string|max:500',
            ]);

            $projectRequest->reject(auth()->id(), $validated['response_message']);

            return $this->respond([
                'data' => $projectRequest->fresh()->load('project', 'requester', 'requestingDepartment')
            ], 'Project request rejected', 200);
        } catch (ValidationException $e) {
            return $this->respondError($e->errors(), 'Validation failed', 422);
        }
    }

    /**
     * Send a project request to another department.
     */
    public function sendProjectRequest(Request $request, Department $department)
    {
        $this->authorize('view', $department);

        try {
            $validated = $request->validate([
                'project_id' => 'required|exists:projects,id',
                'target_department_id' => 'required|exists:departments,id|different:requesting_department_id',
                'request_message' => 'nullable|string|max:500',
            ]);

            // Check if project exists
            $project = \App\Models\Project::find($validated['project_id']);
            if (!$project) {
                return $this->respondError([], 'Project not found', 404);
            }

            // Check if request already exists
            $existingRequest = \App\Models\DepartmentProjectRequest::where('project_id', $project->id)
                ->where('requesting_department_id', $department->id)
                ->where('target_department_id', $validated['target_department_id'])
                ->where('status', '!=', 'Rejected')
                ->first();

            if ($existingRequest) {
                return $this->respondError([], 'A pending or approved request already exists for this project to this department', 409);
            }

            // Create request
            $projectRequest = \App\Models\DepartmentProjectRequest::create([
                'project_id' => $project->id,
                'requesting_department_id' => $department->id,
                'target_department_id' => $validated['target_department_id'],
                'requested_by' => auth()->id(),
                'status' => 'Pending',
                'request_message' => $validated['request_message'] ?? null,
            ]);

            $projectRequest->load('project', 'requestingDepartment', 'targetDepartment', 'requester');

            return $this->respond([
                'data' => $projectRequest
            ], 'Project request sent successfully', 201);
        } catch (ValidationException $e) {
            return $this->respondError($e->errors(), 'Validation failed', 422);
        }
    }

    /**
     * Create a new task for a project in the department.
     */
    public function createTask(Request $request, Department $department)
    {
        try {
            $this->authorize('department.manage', $department);

            $validated = $request->validate([
                'project_id' => 'required|exists:projects,id',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'required|in:pending,in-progress,completed',
                'priority' => 'required|in:low,medium,high',
                'due_date' => 'nullable|date',
                'assigned_to' => 'nullable|exists:users,id',
            ]);

            // Verify the project belongs to this department (either as primary or assigned)
            $project = \App\Models\Project::find($validated['project_id']);
            
            if (!$project || (
                $project->primary_department_id != $department->id &&
                !$project->departments()->where('department_id', $department->id)->exists()
            )) {
                return $this->respondError(
                    null,
                    'Project does not belong to this department',
                    403
                );
            }

            // Create the task
            $task = \App\Models\ProjectTask::create([
                'project_id' => $validated['project_id'],
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'status' => $validated['status'],
                'priority' => $validated['priority'],
                'due_date' => $validated['due_date'] ?? null,
                'assigned_to' => $validated['assigned_to'] ?? null,
                'created_by' => auth()->id(),
            ]);

            $task->load('project', 'assignedUser', 'creator');

            return $this->respond([
                'data' => $task
            ], 'Task created successfully', 201);
        } catch (ValidationException $e) {
            return $this->respondError($e->errors(), 'Validation failed', 422);
        } catch (\Exception $e) {
            return $this->respondError(null, $e->getMessage(), 500);
        }
    }
}

