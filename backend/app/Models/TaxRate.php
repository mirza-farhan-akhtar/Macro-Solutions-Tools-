<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaxRate extends Model
{
    protected $fillable = [
        'name',
        'percentage',
    ];

    protected $casts = [
        'percentage' => 'decimal:2',
    ];
}
