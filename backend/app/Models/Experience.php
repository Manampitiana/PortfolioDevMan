<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        'title',
        'company',
        'start_date',
        'end_date',
        'is_current',
        'type',
        'description',
        'technologies',
        'is_active',
    ];

    protected $casts = [
        'technologies' => 'array',
        'is_current' => 'boolean',
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}
