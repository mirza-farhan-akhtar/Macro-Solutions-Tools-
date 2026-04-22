<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any projects.
     */
    public function viewAny(User $user)
    {
        return true; // All authenticated users can see some projects (filtered in controller)
    }

    /**
     * Determine whether the user can view the project.
     */
    public function view(User $user, Project $project)
    {
        // Super admin can view all projects
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Check if user is project member
        if ($project->isUserMember($user->id)) {
            return true;
        }

        // Check if user is department head and project involves their department
        if ($user->headsOfDepartments->isNotEmpty()) {
            $headedDepartmentIds = $user->headsOfDepartments->pluck('id');
            return $project->departments()
                          ->whereIn('department_id', $headedDepartmentIds)
                          ->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create projects.
     */
    public function create(User $user)
    {
        // Super admin can always create projects
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Department heads can create projects
        return $user->headsOfDepartments->isNotEmpty();
    }

    /**
     * Determine whether the user can update the project.
     */
    public function update(User $user, Project $project)
    {
        // Super admin can update all projects
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Project creator can update
        if ($project->created_by === $user->id) {
            return true;
        }

        // Project leads can update
        $projectLead = $project->getProjectLead();
        if ($projectLead && $projectLead->id === $user->id) {
            return true;
        }

        // Department heads can update projects involving their department
        if ($user->headsOfDepartments->isNotEmpty()) {
            $headedDepartmentIds = $user->headsOfDepartments->pluck('id');
            return $project->departments()
                          ->whereIn('department_id', $headedDepartmentIds)
                          ->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can delete the project.
     */
    public function delete(User $user, Project $project)
    {
        // Only super admin and project creator can delete projects
        return $user->isSuperAdmin() || $project->created_by === $user->id;
    }

    /**
     * Determine whether the user can manage project members.
     */
    public function manageMembers(User $user, Project $project)
    {
        return $this->update($user, $project);
    }

    /**
     * Determine whether the user can assign users from other departments.
     */
    public function assignFromOtherDepartments(User $user, Project $project)
    {
        // Only super admin can assign users from any department directly
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can create collaboration requests.
     */
    public function createCollaborationRequest(User $user, Project $project)
    {
        // User must be able to update the project and be a department head
        return $this->update($user, $project) && $user->headsOfDepartments->isNotEmpty();
    }
}