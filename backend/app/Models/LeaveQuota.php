<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveQuota extends Model
{
    use HasFactory;

    protected $fillable = ['employee_id', 'leave_type', 'quota', 'year'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
