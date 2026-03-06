<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\CloudinaryHelper;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::all();
        return response()->json([
            'success'  => true,
            'projects' => $projects
        ]);
    }

    public function store(Request $request)
    {
        if ($request->has('technologies') && is_string($request->technologies)) {
            $request->merge([
                'technologies' => json_decode($request->technologies, true)
            ]);
        }

        $validated = $request->validate([
            'title'             => 'required|string|max:255',
            'client_name'       => 'nullable|string|max:255',
            'slug'              => 'nullable|string|max:255|unique:projects,slug',
            'short_description' => 'nullable|string|max:255',
            'description'       => 'nullable|string',
            'start_date'        => 'nullable|date',
            'end_date'          => 'nullable|date|after_or_equal:start_date',
            'is_current'        => 'nullable|boolean',
            'cover_image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:8048',
            'gallery.*'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:8048',
            'technologies'      => 'nullable|array',
            'technologies.*'    => 'string|max:50',
            'status'            => 'required|in:draft,published',
            'is_featured'       => 'boolean',
            'project_url'       => 'nullable|url|max:255',
            'github_url'        => 'nullable|url|max:255',
        ]);

        if (isset($validated['technologies']) && is_array($validated['technologies'])) {
            $validated['technologies'] = json_encode($validated['technologies']);
        }

        // Cover image
        if ($request->hasFile('cover_image')) {
            $result                             = CloudinaryHelper::upload($request->file('cover_image'), 'portfolio/projects');
            $validated['cover_image']           = $result['secure_url'];
            $validated['cover_image_public_id'] = $result['public_id'];
        }

        // Gallery
        if ($request->hasFile('gallery')) {
            $galleryUrls      = [];
            $galleryPublicIds = [];
            foreach ($request->file('gallery') as $file) {
                $result             = CloudinaryHelper::upload($file, 'portfolio/projects/gallery');
                $galleryUrls[]      = $result['secure_url'];
                $galleryPublicIds[] = $result['public_id'];
            }
            $validated['gallery']            = json_encode($galleryUrls);
            $validated['gallery_public_ids'] = json_encode($galleryPublicIds);
        }

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $project = Project::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully!',
            'project' => $project
        ], 201);
    }

    public function show(string $id)
    {
        $project = Project::findOrFail($id);
        $project->increment('views');

        return response()->json([
            'success' => true,
            'project' => $project
        ]);
    }

    public function update(Request $request, string $id)
    {
        $project = Project::findOrFail($id);

        if ($request->has('technologies') && is_string($request->technologies)) {
            $request->merge([
                'technologies' => json_decode($request->technologies, true)
            ]);
        }

        $validated = $request->validate([
            'title'             => 'required|string|max:255',
            'client_name'       => 'nullable|string|max:255',
            'slug'              => 'nullable|string|max:255|unique:projects,slug,' . $id,
            'short_description' => 'nullable|string|max:255',
            'description'       => 'nullable|string',
            'start_date'        => 'nullable|date',
            'end_date'          => 'nullable|date|after_or_equal:start_date',
            'is_current'        => 'nullable|boolean',
            'cover_image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:8048',
            'gallery.*'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:8048',
            'technologies'      => 'nullable|array',
            'technologies.*'    => 'string|max:50',
            'status'            => 'required|in:draft,published',
            'is_featured'       => 'boolean',
            'project_url'       => 'nullable|url|max:255',
            'github_url'        => 'nullable|url|max:255',
        ]);

        if (isset($validated['technologies']) && is_array($validated['technologies'])) {
            $validated['technologies'] = json_encode($validated['technologies']);
        }

        // Cover image update
        if ($request->hasFile('cover_image')) {
            if ($project->cover_image_public_id) {
                CloudinaryHelper::destroy($project->cover_image_public_id);
            }
            $result                             = CloudinaryHelper::upload($request->file('cover_image'), 'portfolio/projects');
            $validated['cover_image']           = $result['secure_url'];
            $validated['cover_image_public_id'] = $result['public_id'];
        }

        // Gallery update
        if ($request->hasFile('gallery')) {
            if ($project->gallery_public_ids) {
                $oldPublicIds = json_decode($project->gallery_public_ids, true);
                foreach ($oldPublicIds as $publicId) {
                    CloudinaryHelper::destroy($publicId);
                }
            }
            $galleryUrls      = [];
            $galleryPublicIds = [];
            foreach ($request->file('gallery') as $file) {
                $result             = CloudinaryHelper::upload($file, 'portfolio/projects/gallery');
                $galleryUrls[]      = $result['secure_url'];
                $galleryPublicIds[] = $result['public_id'];
            }
            $validated['gallery']            = json_encode($galleryUrls);
            $validated['gallery_public_ids'] = json_encode($galleryPublicIds);
        }

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $project->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully!',
            'project' => $project
        ]);
    }

    public function destroy(string $id)
    {
        $project = Project::findOrFail($id);

        if ($project->cover_image_public_id) {
            CloudinaryHelper::destroy($project->cover_image_public_id);
        }

        if ($project->gallery_public_ids) {
            $publicIds = json_decode($project->gallery_public_ids, true);
            foreach ($publicIds as $publicId) {
                CloudinaryHelper::destroy($publicId);
            }
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully!'
        ]);
    }
}