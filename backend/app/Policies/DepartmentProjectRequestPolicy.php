<?php

namespace App\Policies;

use App\Models\DepartmentProjectRequest;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DepartmentProjectRequestPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any collaboration requests.
     */
    public function viewAny(User $user)
    {
        // Super admin and department heads can view collaboration requests
        return $user->isSuperAdmin() || $user->headsOfDepartments->isNotEmpty();
    }

    /**
     * Determine whether the user can view the collaboration request.
     */
    public function view(User $user, DepartmentProjectRequest $request)
    {
        // Super admin can view all requests
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Requester can view their own requests
        if ($request->requested_by === $user->id) {
            return true;
        }

        // Target department head can view requests targeting their department
        if ($request->targetDepartment->head_id === $user->id) {
            return true;
        }

        // Requesting department head can view their department's requests
        if ($request->requestingDepartment->head_id === $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create collaboration requests.
     */
    public function create(User $user)
    {
        // Super admin and department heads can create collaboration requests
        return $user->isSuperAdmin() || $user->headsOfDepartments->isNotEmpty();
    }

    /**
     * Determine whether the user can approve/reject collaboration requests.
     */
    public function respond(User $user, DepartmentProjectRequest $request)
    {
        // Super admin can respond to any request
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Only target department head can approve/reject requests
        return $request->canBeApprovedBy($user->id);
    }

    /**
     * Determine whether the user can update the collaboration request.
     */
    public function update(User $user, DepartmentProjectRequest $request)
    {
        // Super admin can update any request
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Requester can update pending requests they created
        return $request->requested_by === $user->id && $request->isPending();
    }

    /**
     * Determine whether the user can delete the collaboration request.
     */
    public function delete(User $user, DepartmentProjectRequest $request)
    {
        // Super admin can delete any request
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Requester can delete their own pending requests
        return $request->requested_by === $user->id && $request->isPending();
    }

    /**
     * Determine whether the user can cancel the collaboration request.
     */
    public function cancel(User $user, DepartmentProjectRequest $request)
    {
        return $this->delete($user, $request);
    }
}