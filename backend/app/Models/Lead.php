<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'company_name',
        'subject',
        'message',
        'source',
        'status',
        'lead_status',
        'assigned_to',
        'industry',
        'budget_range',
        'priority',
        'tags',
        'notes',
        'last_contact_at',
        'next_follow_up_at',
        'client_id',
    ];

    protected $casts = [
        'tags' => 'json',
        'last_contact_at' => 'datetime',
        'next_follow_up_at' => 'datetime',
    ];

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function client()
    {
        return $this->hasOne(Client::class);
    }

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    public function activities()
    {
        return $this->morphMany(Activity::class, 'related');
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('lead_status', $status);
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeBySource($query, $source)
    {
        return $query->where('source', $source);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    public function scopeQualified($query)
    {
        return $query->where('lead_status', 'qualified');
    }

    // Helpers
    public function convertToClient(array $clientData)
    {
        return Client::create(array_merge($clientData, ['lead_id' => $this->id]));
    }
}
