<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Models\DepartmentProjectRequest;
use App\Services\ProjectCollaborationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CollaborationRequestController extends BaseController
{
    protected $collaborationService;

    public function __construct(ProjectCollaborationService $collaborationService)
    {
        $this->collaborationService = $collaborationService;
    }

    /**
     * Display a listing of collaboration requests
     */
    public function index(Request $request)
    {
        try {
            $this->authorize('viewAny', DepartmentProjectRequest::class);

            $user = Auth::user();
            $query = DepartmentProjectRequest::with([
                'project:id,name,code',
                'requestingDepartment:id,name,code', 
                'targetDepartment:id,name,code',
                'requester:id,name,email',
                'targetUser:id,name,email',
                'approver:id,name,email'
            ]);

            // Filter based on user role and permissions
            if (!$user->isSuperAdmin()) {
                $departmentIds = $user->headsOfDepartments->pluck('id');
                
                $query->where(function ($q) use ($departmentIds, $user) {
                    // Requests targeting departments the user heads
                    $q->whereIn('target_department_id', $departmentIds)
                      // Requests made by departments the user heads  
                      ->orWhereIn('requesting_department_id', $departmentIds)
                      // Requests made by the user
                      ->orWhere('requested_by', $user->id);
                });
            }

            // Apply filters
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            if ($request->filled('department_id')) {
                $query->where(function ($q) use ($request) {
                    $q->where('requesting_department_id', $request->department_id)
                      ->orWhere('target_department_id', $request->department_id);
                });
            }

            if ($request->filled('project_id')) {
                $query->where('project_id', $request->project_id);
            }

            $requests = $query->orderBy('created_at', 'desc')
                             ->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $requests,
                'message' => 'Collaboration requests retrieved successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error loading collaboration requests: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error loading collaboration requests',
                'data' => ['error' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Get pending requests for the current user (as department head)
     */
    public function getPendingRequests()
    {
        $user = Auth::user();
        
        $requests = $this->collaborationService->getPendingRequestsForDepartmentHead($user);
        
        return response()->json([
            'success' => true,
            'data' => $requests,
            'message' => 'Pending collaboration requests retrieved successfully'
        ]);
    }

    /**
     * Create a new collaboration request
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'project_id'           => 'required|exists:projects,id',
                'target_department_id' => 'required|exists:departments,id',
                'target_user_id'       => 'nullable|exists:users,id',
                'request_message'      => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation Error',
                    'data'    => $validator->errors(),
                ], 422);
            }

            $user = Auth::user();

            // Determine requesting department
            $requestingDeptId = $user->department_id
                ?? $user->headsOfDepartments()->first()?->id;

            if (!$requestingDeptId) {
                return response()->json([
                    'success' => false,
                    'message' => 'You must belong to a department to send collaboration requests',
                ], 422);
            }

            // Prevent duplicate pending requests
            $existing = DepartmentProjectRequest::where('project_id', $request->project_id)
                ->where('requesting_department_id', $requestingDeptId)
                ->where('target_department_id', $request->target_department_id)
                ->where('status', 'Pending')
                ->first();

            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'A pending collaboration request already exists for this project.',
                ], 422);
            }

            $collaborationRequest = DepartmentProjectRequest::create([
                'project_id'             => $request->project_id,
                'requesting_department_id' => $requestingDeptId,
                'target_department_id'   => $request->target_department_id,
                'requested_by'           => $user->id,
                'target_user_id'         => $request->target_user_id,
                'request_message'        => $request->request_message,
                'status'                 => 'Pending',
            ]);

            return response()->json([
                'success' => true,
                'data'    => $collaborationRequest,
                'message' => 'Collaboration request sent successfully',
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Error sending collaboration request: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error sending collaboration request',
                'data'    => ['error' => $e->getMessage()],
            ], 500);
        }
    }

    /**
     * Display the specified collaboration request
     */
    public function show($id)
    {
        $request = DepartmentProjectRequest::with([
            'project:id,name,code,description',
            'requestingDepartment:id,name,code', 
            'targetDepartment:id,name,code',
            'requester:id,name,email',
            'targetUser:id,name,email,department_id',
            'approver:id,name,email'
        ])->find($id);

        if (!$request) {
            return response()->json([
                'success' => false,
                'message' => 'Collaboration request not found'
            ], 404);
        }

        $this->authorize('view', $request);

        return response()->json([
            'success' => true,
            'data' => $request,
            'message' => 'Collaboration request retrieved successfully'
        ]);
    }

    /**
     * Approve a collaboration request
     */
    public function approve(Request $request, $id)
    {
        $collaborationRequest = DepartmentProjectRequest::find($id);
        
        if (!$collaborationRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Collaboration request not found'
            ], 404);
        }

        $this->authorize('respond', $collaborationRequest);

        $validator = Validator::make($request->all(), [
            'response_message' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        if (!$collaborationRequest->isPending()) {
            return response()->json([
                'success' => false,
                'message' => 'Request has already been responded to'
            ], 400);
        }

        try {
            $this->collaborationService->approveCollaborationRequest(
                $collaborationRequest,
                Auth::user(),
                $request->response_message
            );

            return response()->json([
                'success' => true,
                'data' => $collaborationRequest,
                'message' => 'Collaboration request approved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error approving request',
                'data' => ['error' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Reject a collaboration request
     */
    public function reject(Request $request, $id)
    {
        $collaborationRequest = DepartmentProjectRequest::find($id);
        
        if (!$collaborationRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Collaboration request not found'
            ], 404);
        }

        $this->authorize('respond', $collaborationRequest);

        $validator = Validator::make($request->all(), [
            'response_message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        if (!$collaborationRequest->isPending()) {
            return response()->json([
                'success' => false,
                'message' => 'Request has already been responded to'
            ], 400);
        }

        try {
            $this->collaborationService->rejectCollaborationRequest(
                $collaborationRequest,
                Auth::user(),
                $request->response_message
            );

            return response()->json([
                'success' => true,
                'data' => $collaborationRequest,
                'message' => 'Collaboration request rejected successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error rejecting request',
                'data' => ['error' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Cancel a pending collaboration request
     */
    public function cancel($id)
    {
        $collaborationRequest = DepartmentProjectRequest::find($id);
        
        if (!$collaborationRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Collaboration request not found'
            ], 404);
        }

        $this->authorize('cancel', $collaborationRequest);

        if (!$collaborationRequest->isPending()) {
            return response()->json([
                'success' => false,
                'message' => 'Only pending requests can be cancelled'
            ], 400);
        }

        $collaborationRequest->update(['status' => 'Cancelled']);

        return response()->json([
            'success' => true,
            'data' => [],
            'message' => 'Collaboration request cancelled successfully'
        ]);
    }

    /**
     * Get collaboration request statistics for department head dashboard
     */
    public function getStats()
    {
        $user = Auth::user();
        
        if ($user->headsOfDepartments->isEmpty() && !$user->isSuperAdmin()) {
            return response()->json([
                'success' => true,
                'data' => [
                    'pending_requests' => 0,
                    'approved_requests' => 0,
                    'rejected_requests' => 0,
                    'sent_requests' => 0,
                ],
                'message' => 'Statistics retrieved successfully'
            ]);
        }

        $departmentIds = $user->headsOfDepartments->pluck('id');
        
        $stats = [
            'pending_requests' => DepartmentProjectRequest::whereIn('target_department_id', $departmentIds)
                                                         ->where('status', 'Pending')
                                                         ->count(),
            'approved_requests' => DepartmentProjectRequest::whereIn('target_department_id', $departmentIds)
                                                          ->where('status', 'Approved')
                                                          ->count(),
            'rejected_requests' => DepartmentProjectRequest::whereIn('target_department_id', $departmentIds)
                                                          ->where('status', 'Rejected')
                                                          ->count(),
            'sent_requests' => DepartmentProjectRequest::whereIn('requesting_department_id', $departmentIds)
                                                       ->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'Collaboration request statistics retrieved successfully'
        ]);
    }
}