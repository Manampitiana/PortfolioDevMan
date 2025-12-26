<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function index()
    {
        return response()->json([
            // Nombre de projets publiés
            'projects' => Project::where('status', 'published')->count(),

            // Nombre de clients uniques
            'clients' => Project::whereNotNull('client_name')
                ->where('status', 'published')
                ->distinct('client_name')
                ->count('client_name'),

            // Années d'expérience (à partir de ta première année réelle)
            'experience' => now()->year - 2024,

            // Satisfaction fixe
            'satisfaction' => 100,
        ]);
    }
}
