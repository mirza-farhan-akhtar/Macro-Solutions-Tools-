<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ChatSession extends Model
{
    protected $fillable = [
        'session_token',
        'visitor_name',
        'visitor_email',
        'visitor_phone',
        'status',
        'assigned_to',
        'ip_address',
        'user_agent',
        'page_url',
        'message_count',
        'human_requested_at',
        'resolved_at',
        'last_activity_at',
    ];

    protected $casts = [
        'human_requested_at' => 'datetime',
        'resolved_at'        => 'datetime',
        'last_activity_at'   => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (ChatSession $session) {
            if (empty($session->session_token)) {
                $session->session_token = (string) Str::uuid();
            }
        });
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class)->orderBy('created_at');
    }

    public function latestMessage(): HasMany
    {
        return $this->hasMany(ChatMessage::class)->latest()->limit(1);
    }

    public function assignedAgent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
