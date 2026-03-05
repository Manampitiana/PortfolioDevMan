<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
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

        // encode technologies ho JSON
        if (isset($validated['technologies']) && is_array($validated['technologies'])) {
            $validated['technologies'] = json_encode($validated['technologies']);
        }

        // Cover image — upload any Cloudinary
        if ($request->hasFile('cover_image')) {
            $uploaded = cloudinary()->uploadFile($request->file('cover_image')->getRealPath(), [
                'folder' => 'portfolio/projects'
            ]);
            $validated['cover_image']            = $uploaded->getSecurePath();
            $validated['cover_image_public_id']  = $uploaded->getPublicId();
        }

        // Gallery — upload tsirairay any Cloudinary
        if ($request->hasFile('gallery')) {
            $galleryUrls      = [];
            $galleryPublicIds = [];
            foreach ($request->file('gallery') as $file) {
                $uploaded = cloudinary()->uploadFile($file->getRealPath(), [
                    'folder' => 'portfolio/projects/gallery'
                ]);
                $galleryUrls[]      = $uploaded->getSecurePath();
                $galleryPublicIds[] = $uploaded->getPublicId();
            }
            $validated['gallery']            = json_encode($galleryUrls);
            $validated['gallery_public_ids'] = json_encode($galleryPublicIds);
        }

        // Slug automatique
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

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $project = Project::findOrFail($id);
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

        // encode technologies ho JSON
        if (isset($validated['technologies']) && is_array($validated['technologies'])) {
            $validated['technologies'] = json_encode($validated['technologies']);
        }

        // Cover image update — fafao taloha any Cloudinary, upload vaovao
        if ($request->hasFile('cover_image')) {
            if ($project->cover_image_public_id) {
                cloudinary()->destroy($project->cover_image_public_id);
            }
            $uploaded = cloudinary()->uploadFile($request->file('cover_image')->getRealPath(), [
                'folder' => 'portfolio/projects'
            ]);
            $validated['cover_image']           = $uploaded->getSecurePath();
            $validated['cover_image_public_id'] = $uploaded->getPublicId();
        }

        // Gallery update — fafao taloha any Cloudinary, upload vaovao
        if ($request->hasFile('gallery')) {
            if ($project->gallery_public_ids) {
                $oldPublicIds = json_decode($project->gallery_public_ids, true);
                foreach ($oldPublicIds as $publicId) {
                    cloudinary()->destroy($publicId);
                }
            }

            $galleryUrls      = [];
            $galleryPublicIds = [];
            foreach ($request->file('gallery') as $file) {
                $uploaded = cloudinary()->uploadFile($file->getRealPath(), [
                    'folder' => 'portfolio/projects/gallery'
                ]);
                $galleryUrls[]      = $uploaded->getSecurePath();
                $galleryPublicIds[] = $uploaded->getPublicId();
            }
            $validated['gallery']            = json_encode($galleryUrls);
            $validated['gallery_public_ids'] = json_encode($galleryPublicIds);
        }

        // Slug automatique raha empty
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $project = Project::findOrFail($id);

        // Fafao ny cover image any Cloudinary
        if ($project->cover_image_public_id) {
            cloudinary()->destroy($project->cover_image_public_id);
        }

        // Fafao ny gallery any Cloudinary
        if ($project->gallery_public_ids) {
            $publicIds = json_decode($project->gallery_public_ids, true);
            foreach ($publicIds as $publicId) {
                cloudinary()->destroy($publicId);
            }
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully!'
        ]);
    }
}
