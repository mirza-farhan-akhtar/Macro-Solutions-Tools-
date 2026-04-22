<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'career_id',
        'applicant_name',
        'applicant_email',
        'phone',
        'resume',
        'cover_letter',
        'status',
        'application_status',
        'internal_notes',
        'assigned_to',
        'interview_date',
    ];

    protected $attributes = [
        'status' => 'pending',
        'application_status' => 'Applied',
    ];

    protected $casts = [
        'interview_date' => 'datetime',
    ];

    public function career()
    {
        return $this->belongsTo(Career::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function interviews()
    {
        return $this->hasMany(Interview::class);
    }

    public function employee()
    {
        return $this->hasOne(Employee::class, 'application_id');
    }
}
