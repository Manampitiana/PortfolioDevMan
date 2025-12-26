<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Project;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'stats' => [
                'totalProjects' => Project::count(),
                'totalViews' => Project::sum('views'), // Raha manana column views ny projects
                'totalMessages' => Message::count(),
            ],
            'unreadCount' => Message::where('is_read', false)->count(), // <--- Eto no mivoaka ilay isa
            'recentMessages' => Message::orderBy('is_read', 'asc')->latest()->take(5)->get(),
        ]);
    }
}
