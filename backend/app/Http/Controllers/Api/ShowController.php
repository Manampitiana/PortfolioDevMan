<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutMe;
use App\Models\Experience;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Http\Request;

class ShowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::where('status', 'published')->orderBy('created_at', 'desc')->get();
    
        return response()->json([
            'success' => true,
            'message' => 'Projects fetched successfully!',
            'projects' => $projects
        ]);
    }
    public function fetch_featured_projects()
    {
        $featuredProjects = Project::where('is_featured', true)
        ->get();
    
        return response()->json([
            'success' => true,
            'message' => 'Projects fetched successfully!',
            'featuredProjects' => $featuredProjects
        ]);
    }

    public function publicSkills()
    {
        $publicSkills = Skill::where('is_active', 1)
        ->orderBy('level', 'desc') // Aleo aloha ny level lehibe
        ->get();

        return response()->json([
            'success' => true,
            'message' => 'Skills fetched successfully!',
            'publicSkills' => $publicSkills
        ]);
    }

    public function experiences()
    {
        $experiences = Experience::where('is_active', 1)->orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'message' => 'Experiences fetched successfully!',
            'experiences' => $experiences
        ]);
    }

    public function incrementView(Project $project)
    {
        $project->increment('views');

        return response()->json([
            'success' => true,
            'views' => $project->views
        ]);
    }

    public function fetch_about_me()
    {
        $aboutMe = AboutMe::first();
        // Raha tiana hita ny URL feno an'ilay sary
        if ($aboutMe && $aboutMe->pdp) {
            $aboutMe->pdp = asset('storage/' . $aboutMe->pdp);
        }
        return response()->json($aboutMe);
    }
}
