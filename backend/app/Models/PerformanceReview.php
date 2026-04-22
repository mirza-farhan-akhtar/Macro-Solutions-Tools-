<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerformanceReview extends Model
{
    protected $fillable = [
        'employee_id', 'review_period', 'rating', 'reviewer_id',
        'comments', 'improvement_notes', 'strengths', 'areas_for_improvement', 'status'
    ];

    protected $casts = [
        'rating' => 'decimal:1',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
