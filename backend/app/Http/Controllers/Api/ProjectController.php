<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::all();
        return response()->json([
            'success' => true,
            'projects' => $projects
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // decode JSON avy amin'ny FormData ho array
        if ($request->has('technologies') && is_string($request->technologies)) {
            $request->merge([
                'technologies' => json_decode($request->technologies, true)
            ]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'client_name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255|unique:projects,slug',
            'short_description' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'nullable|boolean',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'gallery.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string|max:50',
            'status' => 'required|in:draft,published',
            'is_featured' => 'boolean',
            'project_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
        ]);

        // encode array ho JSON alohan'ny insert
        if (isset($validated['technologies']) && is_array($validated['technologies'])) {
            $validated['technologies'] = json_encode($validated['technologies']);
        }

        if (isset($validated['gallery']) && is_array($validated['gallery'])) {
            $validated['gallery'] = json_encode($validated['gallery']);
        }

        // Cover image
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('projects', 'public');
            $validated['cover_image'] = $coverPath;
        }

        // Gallery file upload
        if ($request->hasFile('gallery')) {
            $galleryPaths = [];
            foreach ($request->file('gallery') as $file) {
                $galleryPaths[] = $file->store('projects/gallery', 'public');
            }
            $validated['gallery'] = json_encode($galleryPaths);
        }

        // Slug automatique
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Create project
        $project = Project::create($validated);

    
        return response()->json([
            'success' => true,
            'message' => 'Project created successfully!',
            'project' => $project
        ], 201);
    }
    


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $project = Project::findOrFail($id);

        // Increment views rehefa misy mijery
        $project->increment('views');

        return response()->json([
            'success' => true,
            'project' => $project
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $project = Project::findOrFail($id);
    
        // decode JSON avy amin'ny FormData ho array
        if ($request->has('technologies') && is_string($request->technologies)) {
            $request->merge([
                'technologies' => json_decode($request->technologies, true)
            ]);
        }
    
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'client_name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255|unique:projects,slug,' . $id,
            'short_description' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'nullable|boolean',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'gallery.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string|max:50',
            'status' => 'required|in:draft,published',
            'is_featured' => 'boolean',
            'project_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
        ]);
    
        // encode array ho JSON
        if (isset($validated['technologies']) && is_array($validated['technologies'])) {
            $validated['technologies'] = json_encode($validated['technologies']);
        }
    
        if (isset($validated['gallery']) && is_array($validated['gallery'])) {
            $validated['gallery'] = json_encode($validated['gallery']);
        }
    
        // Cover image update
        if ($request->hasFile('cover_image')) {
            // Delete old cover image raha misy
            if ($project->cover_image && Storage::disk('public')->exists($project->cover_image)) {
                Storage::disk('public')->delete($project->cover_image);
            }
            $coverPath = $request->file('cover_image')->store('projects', 'public');
            $validated['cover_image'] = $coverPath;
        }
    
        // Gallery file update
        if ($request->hasFile('gallery')) {
            // Delete old gallery images
            if ($project->gallery) {
                $oldGallery = json_decode($project->gallery, true);
                foreach ($oldGallery as $oldFile) {
                    if (Storage::disk('public')->exists($oldFile)) {
                        Storage::disk('public')->delete($oldFile);
                    }
                }
            }
    
            $galleryPaths = [];
            foreach ($request->file('gallery') as $file) {
                $galleryPaths[] = $file->store('projects/gallery', 'public');
            }
            $validated['gallery'] = json_encode($galleryPaths);
        }
    
        // Slug automatique raha empty
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }
    
        // Update project
        $project->update($validated);
    
        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully!',
            'project' => $project
        ]);
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $project = Project::findOrFail($id);

        // Delete cover image raha misy
        if ($project->cover_image && Storage::disk('public')->exists($project->cover_image)) {
            Storage::disk('public')->delete($project->cover_image);
        }

        // Delete gallery images raha misy
        if ($project->gallery) {
            $gallery = json_decode($project->gallery, true);
            foreach ($gallery as $file) {
                if (Storage::disk('public')->exists($file)) {
                    Storage::disk('public')->delete($file);
                }
            }
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully!'
        ]);
    }
}
