<?php

namespace App\Policies;

use App\Models\Department;
use App\Models\User;

class DepartmentPolicy
{
    /**
     * Determine if the user can view the index.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('department.view');
    }

    /**
     * Determine if the user can view the department.
     */
    public function view(User $user, Department $department): bool
    {
        // Super admin and users with permission can view
        if ($user->hasPermission('department.view')) {
            return true;
        }

        // Department head can view their own department
        if ($department->head_id === $user->id) {
            return true;
        }

        // Employees can view their own department
        if ($user->department_id === $department->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can create departments.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('department.create');
    }

    /**
     * Determine if the user can update the department.
     */
    public function update(User $user, Department $department): bool
    {
        return $user->hasPermission('department.edit');
    }

    /**
     * Determine if the user can delete the department.
     */
    public function delete(User $user, Department $department): bool
    {
        return $user->hasPermission('department.delete');
    }

    /**
     * Determine if the user can restore the department.
     */
    public function restore(User $user, Department $department): bool
    {
        return $user->hasPermission('department.delete');
    }

    /**
     * Determine if the user can permanently delete the department.
     */
    public function forceDelete(User $user, Department $department): bool
    {
        return $user->hasPermission('department.delete');
    }

    /**
     * Determine if the user can assign users to department.
     */
    public function assignUsers(User $user): bool
    {
        return $user->hasPermission('department.assign.users');
    }

    /**
     * Determine if the user can assign department head.
     */
    public function assignHead(User $user): bool
    {
        // Only admins with explicit permission
        return $user->hasPermission('department.edit');
    }
}
