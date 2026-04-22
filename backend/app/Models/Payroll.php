<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    protected $fillable = [
        'employee_id',
        'salary_amount',
        'paid_at',
        'status',
    ];

    protected $casts = [
        'salary_amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    /**
     * Relationship: Belongs to user (employee)
     */
    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }
}
