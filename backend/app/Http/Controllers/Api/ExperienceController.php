<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $experiences = Experience::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'experiences' => $experiences
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'nullable|boolean',
            'type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string|max:50',
            'is_active' => 'nullable|boolean',
        ]);

        // Create experiences
        $experiences = Experience::create($validated);

    
        return response()->json([
            'success' => true,
            'message' => 'Experience created successfully!',
            'experiences' => $experiences
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $experience = Experience::find($id);

        if (!$experience) {
            return response()->json([
                'success' => false,
                'message' => 'Experience not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'experience' => $experience
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $experience = Experience::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'nullable|boolean',
            'type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string|max:50',
            'is_active' => 'nullable|boolean',
        ]);

        $experience->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Experience updated successfully!',
            'experience' => $experience
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $experience = Experience::findOrFail($id);
        $experience->delete();

        return response()->json([
            'success' => true,
            'message' => 'Experience deleted successfully!'
        ]);
    }
}
