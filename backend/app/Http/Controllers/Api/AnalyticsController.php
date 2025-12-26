<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function totalViews()
{
    $totalViews = Project::sum('views');
    return response()->json([
        'totalViews' => $totalViews
    ]);
}
}
