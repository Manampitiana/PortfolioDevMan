<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $skills = Skill::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'skills'  => $skills
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'level'     => 'required|integer|min:0|max:100',
            'category'  => 'required|string|max:255',
            'logo'      => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:8048',
            'is_active' => 'nullable|boolean',
        ]);

        // Upload logo any Cloudinary
        if ($request->hasFile('logo')) {
            $uploaded = cloudinary()->uploadFile($request->file('logo')->getRealPath(), [
                'folder' => 'portfolio/skills'
            ]);
            $validated['logo']           = $uploaded->getSecurePath();
            $validated['logo_public_id'] = $uploaded->getPublicId();
        }

        $validated['is_active'] = (int) $request->input('is_active', 1);

        $skill = Skill::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Skills created successfully!',
            'skills'  => $skill
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $skill = Skill::findOrFail($id);

        return response()->json([
            'success' => true,
            'skill'   => $skill
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $skill = Skill::findOrFail($id);

        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'level'     => 'required|integer|min:0|max:100',
            'category'  => 'required|string|max:255',
            'logo'      => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:8048',
            'is_active' => 'required|boolean',
        ]);

        // Fafao taloha any Cloudinary, upload vaovao
        if ($request->hasFile('logo')) {
            if ($skill->logo_public_id) {
                cloudinary()->destroy($skill->logo_public_id);
            }
            $uploaded = cloudinary()->uploadFile($request->file('logo')->getRealPath(), [
                'folder' => 'portfolio/skills'
            ]);
            $validated['logo']           = $uploaded->getSecurePath();
            $validated['logo_public_id'] = $uploaded->getPublicId();
        }

        $skill->update($validated);

        return response()->json([
            'message' => 'Skill updated successfully!',
            'skill'   => $skill
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $skill = Skill::findOrFail($id);

        // Fafao ny logo any Cloudinary
        if ($skill->logo_public_id) {
            cloudinary()->destroy($skill->logo_public_id);
        }

        $skill->delete();

        return response()->json([
            'success' => true,
            'message' => 'Skill deleted successfully!'
        ]);
    }
}
