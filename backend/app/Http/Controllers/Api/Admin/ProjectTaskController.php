<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Models\ProjectTask;
use App\Models\Project;
use App\Services\ProjectCollaborationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProjectTaskController extends BaseController
{
    protected $collaborationService;

    public function __construct(ProjectCollaborationService $collaborationService)
    {
        $this->collaborationService = $collaborationService;
    }

    /**
     * Display a listing of tasks based on user permissions
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Get visible tasks query based on user permissions
            $query = $this->collaborationService->getVisibleTasksQuery($user);

            // Apply filters
            if ($request->filled('project_id')) {
                $query->where('project_id', $request->project_id);
            }

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }
            
            if ($request->filled('priority')) {
                $query->where('priority', $request->priority);
            }

            if ($request->filled('assigned_to')) {
                $query->where('assigned_to', $request->assigned_to);
            }

            if ($request->filled('due_date')) {
                $query->whereDate('due_date', $request->due_date);
            }

            if ($request->filled('overdue') && $request->overdue) {
                $query->overdue();
            }

            // Load relationships
            $tasks = $query->with([
                'project:id,name,code,status',
                'assignedUser:id,name,email',
                'creator:id,name,email',
                'parentTask:id,title'
            ])
            ->orderBy('priority', 'desc')
            ->orderBy('due_date', 'asc')
            ->paginate($request->get('per_page', 20));

            return response()->json([
                'success' => true,
                'data' => $tasks,
                'message' => 'Tasks retrieved successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading tasks: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error loading tasks',
                'data' => ['error' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Store a newly created task
     */
    public function store(Request $request)
    {
        $this->authorize('create', ProjectTask::class);

        $validator = Validator::make($request->all(), [
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:Not Started,In Progress,Testing,Review,Completed,Cancelled',
            'priority' => 'nullable|in:Low,Medium,High,Critical',
            'assigned_to' => 'nullable|exists:users,id',
            'parent_task_id' => 'nullable|exists:project_tasks,id',
            'due_date' => 'nullable|date',
            'estimated_hours' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,  
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        // Check if user can create tasks for this project
        $project = Project::find($request->project_id);
        $this->authorize('createForProject', [ProjectTask::class, $project]);

        $task = ProjectTask::create([
            'project_id' => $request->project_id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->get('status', 'Not Started'),
            'priority' => $request->get('priority', 'Medium'),
            'assigned_to' => $request->assigned_to,
            'created_by' => Auth::id(),
            'parent_task_id' => $request->parent_task_id,
            'due_date' => $request->due_date,
            'estimated_hours' => $request->estimated_hours,
            'notes' => $request->notes,
        ]);

        $task->load(['project', 'assignedUser', 'creator']);

        return response()->json([
            'success' => true,
            'data' => $task,
            'message' => 'Task created successfully'
        ], 201);
    }

    /**
     * Display the specified task
     */
    public function show($id)
    {
        $task = ProjectTask::with([
            'project:id,name,code,status',
            'assignedUser:id,name,email',
            'creator:id,name,email',
            'parentTask:id,title',
            'subTasks:id,title,status,assigned_to,due_date'
        ])->find($id);

        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        $this->authorize('view', $task);

        return response()->json([
            'success' => true,
            'data' => $task,
            'message' => 'Task retrieved successfully'
        ]);
    }

    /**
     * Update the specified task
     */
    public function update(Request $request, $id)
    {
        $task = ProjectTask::find($id);
        
        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        $this->authorize('update', $task);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:Not Started,In Progress,Testing,Review,Completed,Cancelled',
            'priority' => 'sometimes|in:Low,Medium,High,Critical',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
            'estimated_hours' => 'nullable|integer|min:0',
            'actual_hours' => 'nullable|integer|min:0',
            'progress' => 'nullable|integer|min:0|max:100',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        // Handle status change to completed
        if ($request->status === 'Completed' && $task->status !== 'Completed') {
            $task->markAsCompleted();
        } else {
            $task->update($request->only([
                'title', 'description', 'status', 'priority',
                'assigned_to', 'due_date', 'estimated_hours',
                'actual_hours', 'progress', 'notes'
            ]));
        }

        return response()->json([
            'success' => true,
            'data' => $task,
            'message' => 'Task updated successfully'
        ]);
    }

    /**
     * Mark task as complete
     */
    public function complete($id)
    {
        $task = ProjectTask::find($id);
        
        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        $this->authorize('complete', $task);

        $task->markAsCompleted();

        return response()->json([
            'success' => true,
            'data' => $task,
            'message' => 'Task marked as completed'
        ]);
    }

    /**
     * Remove the specified task
     */
    public function destroy($id)
    {
        $task = ProjectTask::find($id);
        
        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        $this->authorize('delete', $task);

        $task->delete();

        return response()->json([
            'success' => true,
            'data' => [],
            'message' => 'Task deleted successfully'
        ]);
    }

    /**
     * Get user's dashboard statistics
     */
    public function getDashboardStats()
    {
        $user = Auth::user();
        
        $stats = [
            'assigned_projects' => $user->activeProjects()->count(),
            'assigned_tasks' => $user->assignedTasks()->count(),
            'active_tasks' => $user->activeTasks()->count(),
            'completed_tasks' => $user->completedTasks()->count(),
            'overdue_tasks' => $user->assignedTasks()->overdue()->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'Dashboard statistics retrieved successfully'
        ]);
    }
}