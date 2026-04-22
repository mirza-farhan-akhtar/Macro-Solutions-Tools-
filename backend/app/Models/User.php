<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
        'status',
        'department_id',
        'designation',
        'employment_type',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function blogs()
    {
        return $this->hasMany(Blog::class);
    }

    public function assignedLeads()
    {
        return $this->hasMany(Lead::class, 'assigned_to');
    }

    public function managedClients()
    {
        return $this->hasMany(Client::class, 'assigned_account_manager');
    }

    public function dealsAssigned()
    {
        return $this->hasMany(Deal::class, 'assigned_to');
    }

    public function createdActivities()
    {
        return $this->hasMany(Activity::class, 'created_by');
    }

    public function assignedActivities()
    {
        return $this->hasMany(Activity::class, 'assigned_to');
    }

    public function createdProposals()
    {
        return $this->hasMany(Proposal::class, 'created_by');
    }

    // ==================== DEPARTMENT RELATIONSHIPS ====================

    /**
     * A user belongs to a department
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get departments where this user is the head
     */
    public function headsOfDepartments()
    {
        return $this->hasMany(Department::class, 'head_id');
    }

    // ==================== PROJECT RELATIONSHIPS ====================

    /**
     * Projects created by this user
     */
    public function createdProjects()
    {
        return $this->hasMany(Project::class, 'created_by');
    }

    /**
     * Projects where this user is a member
     */
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_members')
                    ->withPivot([
                        'role_in_project',
                        'is_lead',
                        'joined_at',
                        'left_at',
                        'responsibilities',
                        'status'
                    ])
                    ->withTimestamps();
    }

    /**
     * Active projects for this user
     */
    public function activeProjects()
    {
        return $this->projects()->wherePivot('status', 'Active');
    }

    /**
     * Projects where this user is a lead
     */
    public function leadingProjects()
    {
        return $this->projects()->wherePivot('is_lead', true)->wherePivot('status', 'Active');
    }

    /**
     * Tasks assigned to this user
     */
    public function assignedTasks()
    {
        return $this->hasMany(ProjectTask::class, 'assigned_to');
    }

    /**
     * Tasks created by this user
     */
    public function createdTasks()
    {
        return $this->hasMany(ProjectTask::class, 'created_by');
    }

    /**
     * Active tasks for this user
     */
    public function activeTasks()
    {
        return $this->assignedTasks()->active();
    }

    /**
     * Completed tasks for this user
     */
    public function completedTasks()
    {
        return $this->assignedTasks()->completed();
    }

    /**
     * Collaboration requests made by this user
     */
    public function collaborationRequests()
    {
        return $this->hasMany(DepartmentProjectRequest::class, 'requested_by');
    }

    /**
     * Collaboration requests targeting this user
     */
    public function targetedCollaborationRequests()
    {
        return $this->hasMany(DepartmentProjectRequest::class, 'target_user_id');
    }

    // ==================== RBAC RELATIONSHIPS ====================

    /**
     * A user belongs to many roles
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user')->withTimestamps();
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole($role)
    {
        if (is_string($role)) {
            return $this->roles->contains('slug', $role);
        }

        return $this->roles->contains($role);
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyRole(array $roles)
    {
        return $this->roles->whereIn('slug', $roles)->isNotEmpty();
    }

    /**
     * Check if user is super admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super-admin');
    }

    /**
     * Check if user has a specific permission
     */
    public function hasPermission($permission)
    {
        // Super admin has all permissions
        if ($this->isSuperAdmin()) {
            return true;
        }

        if (is_string($permission)) {
            return $this->getAllPermissions()->contains('slug', $permission);
        }

        return $this->getAllPermissions()->contains($permission);
    }

    /**
     * Check if user has any of the given permissions
     */
    public function hasAnyPermission(array $permissions)
    {
        // Super admin has all permissions
        if ($this->isSuperAdmin()) {
            return true;
        }

        return $this->getAllPermissions()->whereIn('slug', $permissions)->isNotEmpty();
    }

    /**
     * Check if user has all of the given permissions
     */
    public function hasAllPermissions(array $permissions)
    {
        // Super admin has all permissions
        if ($this->isSuperAdmin()) {
            return true;
        }

        $userPermissions = $this->getAllPermissions()->pluck('slug')->toArray();
        
        foreach ($permissions as $permission) {
            if (!in_array($permission, $userPermissions)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get all permissions for the user (through roles)
     */
    public function getAllPermissions()
    {
        return $this->roles->flatMap(function ($role) {
            return $role->permissions;
        })->unique('id');
    }

    /**
     * Assign role to user
     */
    public function assignRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->firstOrFail();
        }

        return $this->roles()->syncWithoutDetaching([$role->id]);
    }

    /**
     * Remove role from user
     */
    public function removeRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->firstOrFail();
        }

        return $this->roles()->detach($role->id);
    }

    /**
     * Sync roles
     */
    public function syncRoles(array $roleIds)
    {
        return $this->roles()->sync($roleIds);
    }
}
