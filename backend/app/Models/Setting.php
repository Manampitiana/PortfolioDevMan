<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'site_name',
        'tagline',
        'logo',
        'favicon',
        'theme_color',
        'meta_description',
        'meta_keywords',
        'contact_email',
        'contact_phone',
        'social_links',
        'maintenance_mode',
    ];

    protected $casts = [
        'social_links' => 'array',
        'maintenance_mode' => 'boolean',
    ];
}
