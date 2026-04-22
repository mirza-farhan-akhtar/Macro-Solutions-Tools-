<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'meeting_date',
        'meeting_time',
        'duration',
        'location',
        'meeting_link',
        'organizer_id',
        'status',
        'attendee_user_ids',
        'attendee_employee_ids',
    ];

    protected $casts = [
        'attendee_user_ids'     => 'array',
        'attendee_employee_ids' => 'array',
    ];

    public function organizer()
    {
        return $this->belongsTo(\App\Models\User::class, 'organizer_id');
    }
}
