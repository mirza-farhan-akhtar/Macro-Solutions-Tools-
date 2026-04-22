<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Project;
use App\Models\User;
use App\Services\ProjectCollaborationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DepartmentWorkspaceController extends Controller
{
    protected $collaborationService;

    public function __construct(ProjectCollaborationService $collaborationService)
    {
        $this->collaborationService = $collaborationService;
    }

    /**
     * Resolve department by slug and check user access.
     * Admins/super-admins can access any department.
     * Regular users can only access their own department.
     */
    private function resolveDepartment(string $departmentSlug)
    {
        $user = Auth::user();
        $department = Department::where('slug', $departmentSlug)
            ->with(['head', 'parent', 'employees'])
            ->first();

        if (!$department) {
            return [null, null, response()->json([
                'success' => false,
                'message' => 'Department not found',
                'data' => null
            ], 404)];
        }

        // Admins and super-admins can view any department workspace
        if ($user->isSuperAdmin() || $user->isAdmin()) {
            return [$user, $department, null];
        }

        // Regular users must belong to this department
        if ($user->department_id !== $department->id) {
            return [null, null, response()->json([
                'success' => false,
                'message' => 'Access denied: you do not belong to this department',
                'data' => null
            ], 403)];
        }

        return [$user, $department, null];
    }

    /**
     * Get department workspace dashboard
     */
    public function dashboard(string $departmentSlug)
    {
        try {
            [$user, $department, $error] = $this->resolveDepartment($departmentSlug);
            if ($error) return $error;

            // Get projects for this department (primary owner OR linked via departments relation)
            $deptProjectQuery = function ($q) use ($department) {
                $q->where('primary_department_id', $department->id)
                  ->orWhereHas('departments', function ($q) use ($department) {
                      $q->where('department_id', $department->id);
                  });
            };

            $totalProjects = Project::where(function ($q) use ($department) {
                $q->where('primary_department_id', $department->id)
                  ->orWhereHas('departments', function ($q) use ($department) {
                      $q->where('department_id', $department->id);
                  });
            })->count();

            $activeProjects = Project::where(function ($q) use ($department) {
                $q->where('primary_department_id', $department->id)
                  ->orWhereHas('departments', function ($q) use ($department) {
                      $q->where('department_id', $department->id);
                  });
            })->whereIn('status', ['Planning', 'In Progress'])->count();

            $completedProjects = Project::where(function ($q) use ($department) {
                $q->where('primary_department_id', $department->id)
                  ->orWhereHas('departments', function ($q) use ($department) {
                      $q->where('department_id', $department->id);
                  });
            })->where('status', 'Completed')->count();

            // Get team members count
            $teamMembersCount = User::where('department_id', $department->id)->count();

            // Get recent projects for this department
            $recentProjects = Project::where('primary_department_id', $department->id)
                ->orWhereHas('departments', function ($q) use ($department) {
                    $q->where('department_id', $department->id);
                })
                ->latest()
                ->take(5)
                ->get(['id', 'name', 'code', 'status', 'priority']);

            $dashboard = [
                'department' => $department,
                'stats' => [
                    'total_projects' => $totalProjects,
                    'active_projects' => $activeProjects,
                    'completed_projects' => $completedProjects,
                    'team_members' => $teamMembersCount,
                ],
                'recent_projects' => $recentProjects,
            ];

            return response()->json([
                'success' => true,
                'data' => $dashboard,
                'message' => 'Workspace dashboard loaded successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading workspace dashboard: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error loading workspace dashboard',
                'data' => ['error' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Get projects for department workspace
     */
    public function projects(Request $request, string $departmentSlug)
    {
        try {
            [$user, $department, $error] = $this->resolveDepartment($departmentSlug);
            if ($error) return $error;

            // Show all projects this department is involved in (primary owner OR participating)
            $query = Project::where('primary_department_id', $department->id)
                ->orWhereHas('departments', function ($q) use ($department) {
                    $q->where('department_id', $department->id);
                });

            // Filter by status
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            // Search by name or code
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                });
            }

            $projects = $query->with(['creator:id,name,email', 'primaryDepartment:id,name'])
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 15));

            // Tag each project as primary or participating
            $projects->getCollection()->transform(function ($project) use ($department) {
                $project->project_type = $project->primary_department_id === $department->id
                    ? 'primary'
                    : 'participating';
                return $project;
            });

            return response()->json([
                'success' => true,
                'data' => $projects,
                'message' => 'Department projects retrieved successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading department projects: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error loading department projects',
                'data' => ['error' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Get team members for department workspace
     */
    public function teamMembers(Request $request, string $departmentSlug)
    {
        try {
            [$user, $department, $error] = $this->resolveDepartment($departmentSlug);
            if ($error) return $error;

            $query = User::where('department_id', $department->id);

            // Search by name or email
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $teamMembers = $query->select('id', 'name', 'email', 'department_id')
                ->with(['roles:id,name', 'department:id,name'])
                ->orderBy('name')
                ->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $teamMembers,
                'message' => 'Team members retrieved successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading team members: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error loading team members',
                'data' => ['error' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Get notifications for department workspace
     */
    public function notifications(Request $request, string $departmentSlug)
    {
        try {
            [$user, $department, $error] = $this->resolveDepartment($departmentSlug);
            if ($error) return $error;

            $query = \App\Models\DepartmentProjectRequest::query();

            // Department heads see pending requests for their department
            if ($department->head_id === $user->id || $user->isSuperAdmin() || $user->isAdmin()) {
                $query->where('target_department_id', $department->id);
            } else {
                // Regular members see requests related to their department (as requester or target)
                $query->where(function ($q) use ($department) {
                    $q->where('target_department_id', $department->id)
                      ->orWhere('requesting_department_id', $department->id);
                });
            }

            $notifications = $query->with([
                'project:id,name,code',
                'requestingDepartment:id,name',
                'targetDepartment:id,name'
            ])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 10));

            return response()->json([
                'success' => true,
                'data' => $notifications,
                'message' => 'Notifications retrieved successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading notifications: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error loading notifications',
                'data' => ['error' => $e->getMessage()]
            ], 500);
        }
    }
}