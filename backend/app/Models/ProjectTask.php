<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectTask extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'status',
        'priority',
        'assigned_to',
        'created_by',
        'parent_task_id',
        'due_date',
        'completed_at',
        'estimated_hours',
        'actual_hours',
        'progress',
        'notes',
        'attachments',
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_at' => 'datetime',
        'attachments' => 'json',
    ];

    // Relationships
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function parentTask()
    {
        return $this->belongsTo(ProjectTask::class, 'parent_task_id');
    }

    public function subTasks()
    {
        return $this->hasMany(ProjectTask::class, 'parent_task_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['Not Started', 'In Progress', 'Testing', 'Review']);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'Completed');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
                    ->whereNotIn('status', ['Completed', 'Cancelled']);
    }

    public function scopeByPriority($query)
    {
        return $query->orderByRaw("FIELD(priority, 'Critical', 'High', 'Medium', 'Low')");
    }

    // Helper methods
    public function isOverdue()
    {
        return $this->due_date && 
               $this->due_date->isPast() && 
               !in_array($this->status, ['Completed', 'Cancelled']);
    }

    public function canBeEditedBy($userId)
    {
        // Task can be edited by the assigned user, creator, or project members with lead role
        if ($this->assigned_to === $userId || $this->created_by === $userId) {
            return true;
        }

        // Check if user is a project lead
        return $this->project->members()
                    ->where('user_id', $userId)
                    ->wherePivot('is_lead', true)
                    ->wherePivot('status', 'Active')
                    ->exists();
    }

    public function markAsCompleted()
    {
        $this->update([
            'status' => 'Completed',
            'progress' => 100,
            'completed_at' => now(),
        ]);
    }

    public function updateProgress($percentage)
    {
        $this->update(['progress' => $percentage]);

        if ($percentage >= 100) {
            $this->markAsCompleted();
        }
    }

    public function getDaysRemaining()
    {
        if (!$this->due_date || $this->status === 'Completed') {
            return null;
        }

        return $this->due_date->diffInDays(now(), false);
    }
}