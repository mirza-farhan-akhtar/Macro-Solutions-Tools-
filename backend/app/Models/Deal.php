<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    use HasFactory;

    protected $fillable = [
        'deal_name',
        'client_id',
        'lead_id',
        'value',
        'stage',
        'probability',
        'expected_closing_date',
        'assigned_to',
        'notes',
        'won_date',
        'lost_reason',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'probability' => 'integer',
        'expected_closing_date' => 'date',
        'won_date' => 'date',
    ];

    // Relationships
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function proposals()
    {
        return $this->hasMany(Proposal::class);
    }

    public function activities()
    {
        return $this->morphMany(Activity::class, 'related');
    }

    // Scopes
    public function scopeByStage($query, $stage)
    {
        return $query->where('stage', $stage);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    public function scopeWon($query)
    {
        return $query->where('stage', 'won');
    }

    public function scopeLost($query)
    {
        return $query->where('stage', 'lost');
    }

    // Helpers
    public function isWon()
    {
        return $this->stage === 'won';
    }

    public function isLost()
    {
        return $this->stage === 'lost';
    }

    public function markWon()
    {
        $this->update([
            'stage' => 'won',
            'won_date' => now(),
            'probability' => 100,
        ]);
    }

    public function markLost($reason = null)
    {
        $this->update([
            'stage' => 'lost',
            'lost_reason' => $reason,
            'probability' => 0,
        ]);
    }
}
