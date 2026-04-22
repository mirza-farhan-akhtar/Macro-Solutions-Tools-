<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepartmentProjectRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'requesting_department_id',
        'target_department_id',
        'requested_by',
        'target_user_id',
        'status',
        'approved_by',
        'request_message',
        'response_message',
        'responded_at',
    ];

    protected $casts = [
        'responded_at' => 'datetime',
    ];

    // Relationships
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function requestingDepartment()
    {
        return $this->belongsTo(Department::class, 'requesting_department_id');
    }

    public function targetDepartment()
    {
        return $this->belongsTo(Department::class, 'target_department_id');
    }

    public function requester()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function targetUser()
    {
        return $this->belongsTo(User::class, 'target_user_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'Pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'Approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'Rejected');
    }

    public function scopeForDepartment($query, $departmentId)
    {
        return $query->where('target_department_id', $departmentId);
    }

    public function scopeByDepartment($query, $departmentId)
    {
        return $query->where('requesting_department_id', $departmentId);
    }

    // Helper methods
    public function approve($approverId, $responseMessage = null)
    {
        $this->update([
            'status' => 'Approved',
            'approved_by' => $approverId,
            'response_message' => $responseMessage,
            'responded_at' => now(),
        ]);

        // Automatically add user to project when approved
        $this->addUserToProject();
    }

    public function reject($approverId, $responseMessage = null)
    {
        $this->update([
            'status' => 'Rejected',
            'approved_by' => $approverId,
            'response_message' => $responseMessage,
            'responded_at' => now(),
        ]);
    }

    public function canBeApprovedBy($userId)
    {
        // Check if user is the head of target department
        return $this->targetDepartment->head_id === $userId;
    }

    protected function addUserToProject()
    {
        // Add user to project as member if not already added
        if (!$this->project->isUserMember($this->target_user_id)) {
            $this->project->members()->attach($this->target_user_id, [
                'role_in_project' => 'Developer', // Default role
                'is_lead' => false,
                'joined_at' => now(),
                'status' => 'Active',
                'responsibilities' => 'Cross-department collaboration',
            ]);
        }
    }

    public function isPending()
    {
        return $this->status === 'Pending';
    }

    public function isApproved()
    {
        return $this->status === 'Approved';
    }

    public function isRejected()
    {
        return $this->status === 'Rejected';
    }
}