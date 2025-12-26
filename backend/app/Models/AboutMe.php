<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutMe extends Model
{
    protected $fillable = [
        'pdp',
        'full_name',
        'title',
        'short_bio',
        'description',
        'email',
        'phone',
        'location',
        'is_active',
    ];
}
