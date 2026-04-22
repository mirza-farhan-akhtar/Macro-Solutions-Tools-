<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'related_type',
        'related_id',
        'activity_type',
        'description',
        'scheduled_at',
        'completed',
        'completed_at',
        'created_by',
        'assigned_to',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'completed_at' => 'datetime',
        'completed' => 'boolean',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Polymorphic relationship
    public function related()
    {
        return $this->morphTo(__FUNCTION__, 'related_type', 'related_id');
    }

    // Scopes
    public function scopeForLead($query, $leadId)
    {
        return $query->where('related_type', 'Lead')->where('related_id', $leadId);
    }

    public function scopeForDeal($query, $dealId)
    {
        return $query->where('related_type', 'Deal')->where('related_id', $dealId);
    }

    public function scopeForClient($query, $clientId)
    {
        return $query->where('related_type', 'Client')->where('related_id', $clientId);
    }

    public function scopeIncomplete($query)
    {
        return $query->where('completed', false);
    }

    public function scopeComplete($query)
    {
        return $query->where('completed', true);
    }

    public function scopeOverdue($query)
    {
        return $query->where('completed', false)
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<', now());
    }

    // Helpers
    public function markComplete()
    {
        $this->update([
            'completed' => true,
            'completed_at' => now(),
        ]);
    }

    public function isOverdue()
    {
        return !$this->completed && $this->scheduled_at && $this->scheduled_at < now();
    }
}
