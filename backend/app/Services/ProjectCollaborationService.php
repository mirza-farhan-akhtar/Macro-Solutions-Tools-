<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectTask;
use App\Models\User;
use App\Models\DepartmentProjectRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProjectCollaborationService
{
    /**
     * Attempt to assign a user to a project, handling cross-department logic
     */
    public function assignUserToProject(Project $project, User $targetUser, User $requestingUser, array $memberData = [])
    {
        // Check if it's a cross-department assignment
        if ($this->isCrossDepartmentAssignment($project, $targetUser, $requestingUser)) {
            // Create collaboration request instead of direct assignment
            return $this->createCollaborationRequest($project, $targetUser, $requestingUser, $memberData);
        }

        // Direct assignment for same department or admin users
        return $this->assignUserDirectly($project, $targetUser, $memberData);
    }

    /**
     * Check if this is a cross-department assignment
     */
    protected function isCrossDepartmentAssignment(Project $project, User $targetUser, User $requestingUser): bool
    {
        // Admin can assign anyone directly
        if ($requestingUser->isSuperAdmin()) {
            return false;
        }

        // If requesting user is not a department head, deny
        if ($requestingUser->headsOfDepartments->isEmpty()) {
            return true; // This will force a collaboration request or deny access
        }

        // Get requesting user's departments
        $requestingDepartmentIds = $requestingUser->headsOfDepartments->pluck('id');
        
        // Check if target user belongs to any of the requesting user's departments
        return !$requestingDepartmentIds->contains($targetUser->department_id);
    }

    /**
     * Create a collaboration request for cross-department assignment
     */
    public function createCollaborationRequest(Project $project, User $targetUser, User $requestingUser, array $memberData = [])
    {
        // Validate that target user has a department and department head
        if (!$targetUser->department_id || !$targetUser->department->head_id) {
            throw new \Exception('Target user must belong to a department with a department head.');
        }

        // Check if a pending request already exists
        $existingRequest = DepartmentProjectRequest::where('project_id', $project->id)
            ->where('target_user_id', $targetUser->id)
            ->where('status', 'Pending')
            ->first();

        if ($existingRequest) {
            throw new \Exception('A collaboration request for this user is already pending.');
        }

        // Get requesting department (first one if multiple)
        $requestingDepartment = $requestingUser->headsOfDepartments->first();
        
        if (!$requestingDepartment) {
            throw new \Exception('Requesting user must be a department head.');
        }

        return DepartmentProjectRequest::create([
            'project_id' => $project->id,
            'requesting_department_id' => $requestingDepartment->id,
            'target_department_id' => $targetUser->department_id,
            'requested_by' => $requestingUser->id,
            'target_user_id' => $targetUser->id,
            'status' => 'Pending',
            'request_message' => $memberData['request_message'] ?? 
                               "Request to assign {$targetUser->name} to project: {$project->name}",
        ]);
    }

    /**
     * Assign user directly to project
     */
    public function assignUserDirectly(Project $project, User $targetUser, array $memberData = [])
    {
        // Check if user is already a member
        if ($project->isUserMember($targetUser->id)) {
            throw new \Exception('User is already a member of this project.');
        }

        $defaultData = [
            'role_in_project' => 'Developer',
            'is_lead' => false,
            'joined_at' => now(),
            'status' => 'Active',
            'responsibilities' => $memberData['responsibilities'] ?? 'Project team member',
        ];
        
        // Ensure role_in_project is valid
        if (isset($memberData['role_in_project'])) {
            $validRoles = ['Project Manager', 'Team Lead', 'Developer', 'Designer', 'Analyst', 'QA Engineer', 'DevOps Engineer', 'Consultant', 'Other'];
            if (!in_array($memberData['role_in_project'], $validRoles)) {
                $memberData['role_in_project'] = 'Developer';
            }
        }

        $assignmentData = array_merge($defaultData, $memberData);

        // Remove fields that don't belong in project_members table
        unset($assignmentData['request_message']);

        return $project->members()->attach($targetUser->id, $assignmentData);
    }

    /**
     * Approve a collaboration request
     */
    public function approveCollaborationRequest(DepartmentProjectRequest $request, User $approver, string $responseMessage = null)
    {
        DB::beginTransaction();
        
        try {
            // Validate that approver can approve this request
            if (!$request->canBeApprovedBy($approver->id)) {
                throw new \Exception('You are not authorized to approve this request.');
            }

            // Approve the request
            $request->approve($approver->id, $responseMessage);

            // Log the collaboration
            Log::info('Collaboration request approved', [
                'request_id' => $request->id,
                'project_id' => $request->project_id,
                'target_user_id' => $request->target_user_id,
                'approved_by' => $approver->id,
            ]);

            DB::commit();
            return $request->refresh();
            
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Reject a collaboration request
     */
    public function rejectCollaborationRequest(DepartmentProjectRequest $request, User $approver, string $responseMessage = null)
    {
        // Validate that approver can reject this request
        if (!$request->canBeApprovedBy($approver->id)) {
            throw new \Exception('You are not authorized to reject this request.');
        }

        $request->reject($approver->id, $responseMessage);

        // Log the rejection
        Log::info('Collaboration request rejected', [
            'request_id' => $request->id,
            'project_id' => $request->project_id,
            'target_user_id' => $request->target_user_id,
            'rejected_by' => $approver->id,
            'reason' => $responseMessage,
        ]);

        return $request->refresh();
    }

    /**
     * Get pending collaboration requests for a department head
     */
    public function getPendingRequestsForDepartmentHead(User $departmentHead)
    {
        $departmentIds = $departmentHead->headsOfDepartments->pluck('id');
        
        return DepartmentProjectRequest::with(['project', 'requester', 'targetUser', 'requestingDepartment'])
            ->whereIn('target_department_id', $departmentIds)
            ->where('status', 'Pending')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get collaboration requests made by a department
     */
    public function getRequestsByDepartment(int $departmentId, string $status = null)
    {
        $query = DepartmentProjectRequest::with(['project', 'targetUser', 'targetDepartment', 'approver'])
            ->where('requesting_department_id', $departmentId);

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Remove user from project
     */
    public function removeUserFromProject(Project $project, User $user, string $reason = null)
    {
        $project->members()->updateExistingPivot($user->id, [
            'status' => 'Inactive',
            'left_at' => now(),
        ]);

        // Log the removal
        Log::info('User removed from project', [
            'project_id' => $project->id,
            'user_id' => $user->id,
            'reason' => $reason,
        ]);
    }

    /**
     * Get project visibility query for a user
     */
    public function getVisibleProjectsQuery(User $user)
    {
        $query = Project::query();

        if ($user->isSuperAdmin()) {
            // Admin sees all projects
            return $query;
        }

        // Start with empty result set
        $query->where('id', '=', 0); // This ensures we start with no results

        // Add projects where user is a member
        $query->orWhereHas('members', function ($q) use ($user) {
            $q->where('user_id', $user->id)
              ->where('project_members.status', 'Active');
        });

        // Add projects where user's department is the primary owner
        if ($user->department_id) {
            $query->orWhere('primary_department_id', $user->department_id);
        }

        // Add projects involving user's headed departments
        if ($user->headsOfDepartments->isNotEmpty()) {
            $departmentIds = $user->headsOfDepartments->pluck('id');
            $query->orWhereHas('departments', function ($q) use ($departmentIds) {
                $q->whereIn('department_id', $departmentIds);
            });
        }

        return $query;
    }

    /**
     * Get task visibility query for a user
     */
    public function getVisibleTasksQuery(User $user)
    {
        $query = ProjectTask::query();

        if ($user->isSuperAdmin()) {
            // Admin sees all tasks
            return $query;
        }

        // Employee sees only their assigned tasks
        if ($user->headsOfDepartments->isEmpty()) {
            return $query->where('assigned_to', $user->id);
        }

        // Department head sees tasks assigned to them + tasks in their department projects
        $departmentIds = $user->headsOfDepartments->pluck('id');
        
        $query->where(function ($q) use ($user, $departmentIds) {
            // Tasks assigned to the user
            $q->where('assigned_to', $user->id)
              // Tasks in projects involving their departments
              ->orWhereHas('project.departments', function ($subQ) use ($departmentIds) {
                  $subQ->whereIn('department_id', $departmentIds);
              });
        });

        return $query;
    }
}