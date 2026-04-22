<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Models\Project;
use App\Models\Department;
use App\Models\User;
use App\Services\ProjectCollaborationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProjectController extends BaseController
{
    protected $collaborationService;

    public function __construct(ProjectCollaborationService $collaborationService)
    {
        $this->collaborationService = $collaborationService;
    }

    /**
     * Display a listing of projects based on user permissions
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Get visible projects query based on user permissions
        $query = $this->collaborationService->getVisibleProjectsQuery($user);
        
        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
        
        if ($request->filled('department_id')) {
            $query->whereHas('departments', function ($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Load relationships
        $projects = $query->with([
            'creator:id,name,email',
            'departments:id,name,code',
            'members' => function ($q) {
                $q->wherePivot('status', 'Active')
                  ->select('users.id', 'users.name', 'users.email');
            }
        ])
        ->orderBy('created_at', 'desc')
        ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $projects,
            'message' => 'Projects retrieved successfully'
        ]);
    }

    /**
     * Store a newly created project
     */
    public function store(Request $request)
    {
        $this->authorize('create', Project::class);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:projects,name',
            'code' => 'required|string|max:50|unique:projects,code',
            'description' => 'nullable|string',
            'status' => 'nullable|in:Planning,In Progress,On Hold,Completed,Cancelled',
            'priority' => 'nullable|in:Low,Medium,High,Critical',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'nullable|numeric|min:0',
            'primary_department_id' => 'nullable|exists:departments,id',
            'department_ids' => 'required|array|min:1',
            'department_ids.*' => 'exists:departments,id',
            'member_assignments' => 'nullable|array',
            'member_assignments.*.user_id' => 'exists:users,id',
            'member_assignments.*.role_in_project' => 'nullable|in:Project Manager,Team Lead,Developer,Designer,Analyst,QA Engineer,DevOps Engineer,Consultant,Other',
            'member_assignments.*.is_lead' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error', 
                'data' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        
        try {
            // Create project
            $project = Project::create([
                'name' => $request->name,
                'code' => $request->code,
                'description' => $request->description,
                'status' => $request->get('status', 'Planning'),
                'priority' => $request->get('priority', 'Medium'),
                'created_by' => Auth::id(),
                'primary_department_id' => $request->primary_department_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'budget' => $request->budget,
                'meta_data' => $request->meta_data,
            ]);

            // Attach departments
            $departmentData = [];
            foreach ($request->department_ids as $index => $departmentId) {
                $departmentData[$departmentId] = [
                    'involvement_type' => $index === 0 ? 'Primary' : 'Secondary',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            $project->departments()->attach($departmentData);

            // Add creator as project lead by default
            $project->members()->attach(Auth::id(), [
                'role_in_project' => 'Project Manager',
                'is_lead' => true,
                'joined_at' => now(),
                'status' => 'Active',
                'responsibilities' => 'Project oversight and management',
            ]);

            // Process member assignments
            if ($request->filled('member_assignments')) {
                foreach ($request->member_assignments as $assignment) {
                    // Skip if assigning the creator (already added as project manager)
                    if ($assignment['user_id'] == Auth::id()) {
                        continue;
                    }
                    
                    $targetUser = User::find($assignment['user_id']);
                    
                    // Validate role_in_project value
                    $validRoles = ['Project Manager', 'Team Lead', 'Developer', 'Designer', 'Analyst', 'QA Engineer', 'DevOps Engineer', 'Consultant', 'Other'];
                    $role = $assignment['role_in_project'] ?? 'Developer';
                    if (!in_array($role, $validRoles)) {
                        $role = 'Developer';
                    }
                    
                    $memberData = [
                        'role_in_project' => $role,
                        'is_lead' => $assignment['is_lead'] ?? false,
                        'responsibilities' => $assignment['responsibilities'] ?? null,
                        'request_message' => $assignment['request_message'] ?? null,
                    ];

                    // Use collaboration service to handle assignment
                    $this->collaborationService->assignUserToProject(
                        $project, 
                        $targetUser, 
                        Auth::user(), 
                        $memberData
                    );
                }
            }

            DB::commit();

            // Load relationships for response
            $project->load(['creator', 'departments', 'members']);

            return response()->json([
                'success' => true,
                'data' => $project,
                'message' => 'Project created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Error creating project',
                'data' => ['error' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Display the specified project
     */
    public function show($id)
    {
        try {
            $project = Project::with([
                'creator:id,name,email',
                'departments:id,name,code',
                'members' => function ($q) {
                    $q->select('users.id', 'users.name', 'users.email', 'users.department_id');
                },
                'tasks' => function ($q) {
                    $q->select('id', 'project_id', 'title', 'status', 'priority', 'assigned_to', 'due_date')
                      ->with('assignedUser:id,name');
                },
                'collaborationRequests' => function ($q) {
                    $q->where('status', 'Pending')
                      ->with(['targetUser:id,name', 'requestingDepartment:id,name']);
                }
            ])->find($id);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }

            $this->authorize('view', $project);

            // Add project statistics
            $project->statistics = [
                'total_tasks' => $project->tasks->count(),
                'completed_tasks' => $project->tasks->where('status', 'Completed')->count(),
                'active_members' => $project->members->where('pivot.status', 'Active')->count(),
                'progress_percentage' => $project->getProgressPercentage(),
            ];

            return response()->json([
                'success' => true,
                'data' => $project,
                'message' => 'Project retrieved successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading project: ' . $e->getMessage(), [
                'project_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error loading project',
                'data' => ['error' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Update the specified project
     */
    public function update(Request $request, $id)
    {
        $project = Project::find($id);
        
        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }

        $this->authorize('update', $project);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255|unique:projects,name,' . $id,
            'code' => 'sometimes|string|max:50|unique:projects,code,' . $id,
            'description' => 'nullable|string',
            'status' => 'sometimes|in:Planning,In Progress,On Hold,Completed,Cancelled',
            'priority' => 'sometimes|in:Low,Medium,High,Critical',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'actual_end_date' => 'nullable|date',
            'budget' => 'nullable|numeric|min:0',
            'actual_cost' => 'nullable|numeric|min:0',
            'progress' => 'nullable|integer|min:0|max:100',
            'primary_department_id' => 'nullable|exists:departments,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $project->update($request->only([
            'name', 'code', 'description', 'status', 'priority',
            'start_date', 'end_date', 'actual_end_date',
            'budget', 'actual_cost', 'progress', 'meta_data', 'primary_department_id'
        ]));

        return response()->json([
            'success' => true,
            'data' => $project,
            'message' => 'Project updated successfully'
        ]);
    }

    /**
     * Remove the specified project
     */
    public function destroy($id)
    {
        $project = Project::find($id);
        
        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }

        $this->authorize('delete', $project);

        $project->delete();

        return response()->json([
            'success' => true,
            'data' => [],
            'message' => 'Project deleted successfully'
        ]);
    }

    /**
     * Get departments available for selection
     */
    public function getDepartments()
    {
        $user = Auth::user();
        
        if ($user->isSuperAdmin()) {
            // Admin can select any department
            $departments = Department::active()
                ->select('id', 'name', 'code')
                ->with('activeEmployees:id,name,email,department_id')
                ->get();
        } else {
            // Department heads can only select their own department
            $departments = $user->headsOfDepartments()
                ->select('id', 'name', 'code')
                ->with('activeEmployees:id,name,email,department_id')
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => $departments,
            'message' => 'Departments retrieved successfully'
        ]);
    }

    /**
     * Get users available for project assignment
     */
    public function getUsers()
    {
        $user = Auth::user();
        
        if ($user->isSuperAdmin()) {
            // Admin can assign any user
            $users = User::where('status', 'active')
                ->select('id', 'name', 'email', 'department_id')
                ->with('department:id,name')
                ->get();
        } else {
            // Team leads can only assign users from departments they can access
            $departmentIds = $user->headsOfDepartments()->pluck('id')->toArray();
            
            if ($user->department_id) {
                $departmentIds[] = $user->department_id;
            }
            
            $users = User::where('status', 'active')
                ->whereIn('department_id', $departmentIds)
                ->select('id', 'name', 'email', 'department_id')
                ->with('department:id,name')
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => $users,
            'message' => 'Users retrieved successfully'
        ]);
    }

    /**
     * Assign member to project
     */
    public function assignMember(Request $request, $id)
    {
        $project = Project::find($id);
        
        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }

        $this->authorize('manageMembers', $project);

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'role_in_project' => 'required|in:Project Manager,Team Lead,Developer,Designer,Analyst,QA Engineer,DevOps Engineer,Consultant,Other',
            'is_lead' => 'boolean',
            'responsibilities' => 'nullable|string',
            'request_message' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        try {
            $targetUser = User::find($request->user_id);
            
            $result = $this->collaborationService->assignUserToProject(
                $project, 
                $targetUser, 
                Auth::user(), 
                $request->only(['role_in_project', 'is_lead', 'responsibilities', 'request_message'])
            );

            if ($result instanceof \App\Models\DepartmentProjectRequest) {
                return response()->json([
                    'success' => true,
                    'data' => $result,
                    'message' => 'Collaboration request created successfully'
                ]);
            } else {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'User assigned to project successfully'
                ]);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error assigning member',
                'data' => ['error' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Remove member from project
     */
    public function removeMember(Request $request, $id, $memberId)
    {
        $project = Project::find($id);
        
        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }

        $this->authorize('manageMembers', $project);

        $user = User::find($memberId);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        if (!$project->isUserMember($memberId)) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a member of this project'
            ], 400);
        }

        $this->collaborationService->removeUserFromProject(
            $project, 
            $user, 
            $request->get('reason', 'Removed by project manager')
        );

        return response()->json([
            'success' => true,
            'data' => [],
            'message' => 'Member removed from project successfully'
        ]);
    }
}