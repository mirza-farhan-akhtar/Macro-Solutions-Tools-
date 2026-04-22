<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interview extends Model
{
    protected $fillable = [
        'application_id', 'interviewer_id', 'scheduled_date',
        'interview_type', 'description', 'interview_notes',
        'status', 'rating', 'outcome'
    ];

    protected $casts = [
        'scheduled_date' => 'datetime',
        'rating' => 'decimal:1',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function interviewer()
    {
        return $this->belongsTo(User::class, 'interviewer_id');
    }
}
