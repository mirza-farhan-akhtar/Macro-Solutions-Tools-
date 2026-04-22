<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'position',
        'department',
        'joining_date',
        'birthday',
        'bio',
        'avatar',
        'email',
        'phone',
        'salary',
        'employee_id',
        'employment_type',
        'experience_level',
        'skills',
        'education',
        'achievements',
        'emergency_contact_name',
        'emergency_contact_phone',
        'address',
        'linkedin',
        'twitter',
        'instagram',
        'github',
        'portfolio_url',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'joining_date' => 'date',
        'birthday' => 'date',
        'salary' => 'decimal:2',
        'skills' => 'array',
    ];

    protected $hidden = [
        'salary',
        'emergency_contact_name',
        'emergency_contact_phone',
        'address',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function getAgeAttribute()
    {
        return $this->birthday ? $this->birthday->age : null;
    }

    public function getExperienceYearsAttribute()
    {
        return $this->joining_date ? $this->joining_date->diffInYears(now()) : null;
    }
}
