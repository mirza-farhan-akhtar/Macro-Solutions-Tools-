<?php

namespace App\Policies;

use App\Models\ProjectTask;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectTaskPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any tasks.
     */
    public function viewAny(User $user)
    {
        return true; // All authenticated users can see some tasks (filtered in controller)
    }

    /**
     * Determine whether the user can view the task.
     */
    public function view(User $user, ProjectTask $task)
    {
        // Super admin can view all tasks
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Task assigned to user
        if ($task->assigned_to === $user->id) {
            return true;
        }

        // Task created by user
        if ($task->created_by === $user->id) {
            return true;
        }

        // User can view project that contains this task
        return $task->project && app(\App\Policies\ProjectPolicy::class)->view($user, $task->project);
    }

    /**
     * Determine whether the user can create tasks.
     */
    public function create(User $user)
    {
        // Super admin can create tasks
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Department heads can create tasks
        return $user->headsOfDepartments->isNotEmpty();
    }

    /**
     * Determine whether the user can create a task for a specific project.
     */
    public function createForProject(User $user, $project)
    {
        // Must be able to update the project to create tasks for it
        return app(\App\Policies\ProjectPolicy::class)->update($user, $project);
    }

    /**
     * Determine whether the user can update the task.
     */
    public function update(User $user, ProjectTask $task)
    {
        // Super admin can update all tasks
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Task can be edited by assigned user, creator, or project leads
        return $task->canBeEditedBy($user->id);
    }

    /**
     * Determine whether the user can delete the task.
     */
    public function delete(User $user, ProjectTask $task)
    {
        // Super admin can delete all tasks
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Task creator can delete
        if ($task->created_by === $user->id) {
            return true;
        }

        // Project leads can delete tasks
        return $task->project->members()
                   ->where('user_id', $user->id)
                   ->wherePivot('is_lead', true)
                   ->wherePivot('status', 'Active')
                   ->exists();
    }

    /**
     * Determine whether the user can assign the task to others.
     */
    public function assign(User $user, ProjectTask $task)
    {
        return $this->update($user, $task);
    }

    /**
     * Determine whether the user can mark the task as complete.
     */
    public function complete(User $user, ProjectTask $task)
    {
        // Super admin can complete any task
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Assigned user can complete their task
        if ($task->assigned_to === $user->id) {
            return true;
        }

        // Project leads can complete any task in their projects
        return $task->project->members()
                   ->where('user_id', $user->id)
                   ->wherePivot('is_lead', true)
                   ->wherePivot('status', 'Active')
                   ->exists();
    }
}