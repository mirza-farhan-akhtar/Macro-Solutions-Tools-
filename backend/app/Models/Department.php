<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'slug',
        'description',
        'head_id',
        'parent_id',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->slug && $model->name) {
                $model->slug = \Illuminate\Support\Str::slug($model->name);
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty('name')) {
                $model->slug = \Illuminate\Support\Str::slug($model->name);
            }
        });
    }

    /**
     * Get the route key for implicit model binding.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Get the department head (user).
     */
    public function head(): BelongsTo
    {
        return $this->belongsTo(User::class, 'head_id');
    }

    /**
     * Get the parent department.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'parent_id');
    }

    /**
     * Get child departments.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Department::class, 'parent_id');
    }

    /**
     * Get all employees in this department.
     */
    public function employees(): HasMany
    {
        return $this->hasMany(User::class, 'department_id');
    }

    /**
     * Get active employees.
     */
    public function activeEmployees(): HasMany
    {
        return $this->employees()->where('status', 'active');
    }

    /**
     * Projects involving this department.
     */
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_departments')
                    ->withPivot(['involvement_type', 'notes'])
                    ->withTimestamps();
    }

    /**
     * Active projects for this department.
     */
    public function activeProjects()
    {
        return $this->projects()->whereIn('projects.status', ['Planning', 'In Progress']);
    }

    /**
     * Collaboration requests made by this department.
     */
    public function outgoingCollaborationRequests()
    {
        return $this->hasMany(DepartmentProjectRequest::class, 'requesting_department_id');
    }

    /**
     * Collaboration requests targeting this department.
     */
    public function incomingCollaborationRequests()
    {
        return $this->hasMany(DepartmentProjectRequest::class, 'target_department_id');
    }

    /**
     * Pending collaboration requests for this department.
     */
    public function pendingCollaborationRequests()
    {
        return $this->incomingCollaborationRequests()->where('status', 'Pending');
    }

    /**
     * Get department statistics.
     */
    public function getStats()
    {
        return [
            'total_employees' => $this->employees()->count(),
            'active_employees' => $this->activeEmployees()->count(),
            'total_projects' => $this->projects()->count(),
            'active_projects' => $this->activeProjects()->count(),
            'total_tasks' => $this->getTotalTasks(),
            'completed_tasks' => $this->getCompletedTasks(),
            'pending_tasks' => $this->getPendingTasks(),
            'pending_requests' => $this->pendingCollaborationRequests()->count(),
        ];
    }

    /**
     * Get total tasks for department projects.
     */
    public function getTotalTasks()
    {
        return ProjectTask::whereIn('project_id', $this->projects()->pluck('projects.id'))->count();
    }

    /**
     * Get completed tasks for department projects.
     */
    public function getCompletedTasks()
    {
        return ProjectTask::whereIn('project_id', $this->projects()->pluck('projects.id'))
                         ->where('status', 'Completed')
                         ->count();
    }

    /**
     * Get pending tasks for department projects.
     */
    public function getPendingTasks()
    {
        return ProjectTask::whereIn('project_id', $this->projects()->pluck('projects.id'))
                         ->whereIn('status', ['Not Started', 'In Progress', 'Testing', 'Review'])
                         ->count();
    }

    /**
     * Scope to get only active departments.
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['Active', 'active']);
    }

    /**
     * Scope to get root departments (no parent).
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }
}
