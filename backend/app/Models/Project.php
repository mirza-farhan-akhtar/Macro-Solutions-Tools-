<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'status',
        'priority',
        'created_by',
        'primary_department_id',
        'start_date',
        'end_date',
        'actual_end_date',
        'budget',
        'actual_cost',
        'progress',
        'meta_data',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'actual_end_date' => 'date',
        'budget' => 'decimal:2',
        'actual_cost' => 'decimal:2',
        'meta_data' => 'json',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'project_departments')
                    ->withPivot(['involvement_type', 'notes'])
                    ->withTimestamps();
    }

    public function primaryDepartment()
    {
        return $this->belongsTo(Department::class, 'primary_department_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'project_members')
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

    public function tasks()
    {
        return $this->hasMany(ProjectTask::class);
    }

    public function collaborationRequests()
    {
        return $this->hasMany(DepartmentProjectRequest::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['Planning', 'In Progress']);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'Completed');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->whereHas('members', function ($q) use ($userId) {
            $q->where('user_id', $userId)
              ->where('status', 'Active');
        });
    }

    public function scopeForDepartment($query, $departmentId)
    {
        return $query->whereHas('departments', function ($q) use ($departmentId) {
            $q->where('department_id', $departmentId);
        });
    }

    // Helper methods
    public function isUserMember($userId)
    {
        return $this->members()
                    ->where('user_id', $userId)
                    ->where('project_members.status', 'Active')
                    ->exists();
    }

    public function getProjectLead()
    {
        return $this->members()
                    ->wherePivot('is_lead', true)
                    ->wherePivot('status', 'Active')
                    ->first();
    }

    public function getTasksCount()
    {
        return $this->tasks()->count();
    }

    public function getCompletedTasksCount()
    {
        return $this->tasks()->where('status', 'Completed')->count();
    }

    public function getProgressPercentage()
    {
        $totalTasks = $this->getTasksCount();
        if ($totalTasks === 0) {
            return $this->progress;
        }
        
        $completedTasks = $this->getCompletedTasksCount();
        return round(($completedTasks / $totalTasks) * 100);
    }

    public function isDepartmentInvolved($departmentId)
    {
        return $this->departments()
                    ->where('department_id', $departmentId)
                    ->exists();
    }
}