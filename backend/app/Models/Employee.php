<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'employee_id', 'user_id', 'full_name', 'email', 'phone',
        'department', 'designation', 'joining_date', 'employment_type',
        'salary', 'status', 'emergency_contact', 'emergency_contact_phone',
        'address', 'emergency_contact_relation', 'date_of_birth', 'gender',
        'marital_status', 'bank_account', 'pan_number',
        'work_start_time', 'work_end_time',
    ];

    protected $casts = [
        'joining_date' => 'date',
        'date_of_birth' => 'date',
        'salary' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function performanceReviews()
    {
        return $this->hasMany(PerformanceReview::class);
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }
}
