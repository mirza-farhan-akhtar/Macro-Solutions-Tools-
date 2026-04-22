<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'icon',
        'image',
        'status',
        'sort_order',
        'features',
        'benefits',
        'process_steps',
        'technologies',
    ];

    protected $casts = [
        'features' => 'array',
        'benefits' => 'array',
        'process_steps' => 'array',
        'technologies' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($service) {
            if (empty($service->slug)) {
                $base = Str::slug($service->title);
                $slug = $base;
                $i = 2;
                while (static::where('slug', $slug)->exists()) {
                    $slug = $base . '-' . $i++;
                }
                $service->slug = $slug;
            }
        });

        static::updating(function ($service) {
            if ($service->isDirty('slug')) {
                $base = Str::slug($service->slug);
                $slug = $base;
                $i = 2;
                while (static::where('slug', $slug)->where('id', '!=', $service->id)->exists()) {
                    $slug = $base . '-' . $i++;
                }
                $service->slug = $slug;
            }
        });
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
