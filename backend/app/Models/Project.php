<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'client_name',
        'slug',
        'short_description',
        'description',
        'start_date',
        'end_date',
        'is_current',
        'cover_image',
        'gallery',
        'technologies',
        'is_active',
        'is_featured',
        'views',
        'status',
        'project_url',
        'github_url',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_current' => 'boolean',
    ];
}
