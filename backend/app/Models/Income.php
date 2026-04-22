<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Income extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'client_id',
        'invoice_id',
        'source',
        'amount',
        'payment_method',
        'transaction_reference',
        'received_at',
        'notes',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'received_at' => 'date',
    ];

    /**
     * Relationship: Belongs to client
     */
    public function client()
    {
        return $this->belongsTo(Application::class, 'client_id');
    }

    /**
     * Relationship: Belongs to invoice
     */
    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }
}
