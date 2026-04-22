<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExpenseCategory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Relationship: Has many expenses
     */
    public function expenses()
    {
        return $this->hasMany(Expense::class, 'category_id');
    }
}
