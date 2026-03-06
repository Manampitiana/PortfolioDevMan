<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\CloudinaryHelper;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'skills'  => $skills
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'level'     => 'required|integer|min:0|max:100',
            'category'  => 'required|string|max:255',
            'logo'      => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:8048',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('logo')) {
            $result                      = CloudinaryHelper::upload($request->file('logo'), 'portfolio/skills');
            $validated['logo']           = $result['secure_url'];
            $validated['logo_public_id'] = $result['public_id'];
        }

        $validated['is_active'] = (int) $request->input('is_active', 1);

        $skill = Skill::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Skills created successfully!',
            'skills'  => $skill
        ], 201);
    }

    public function show(string $id)
    {
        $skill = Skill::findOrFail($id);
        return response()->json([
            'success' => true,
            'skill'   => $skill
        ]);
    }

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

        if ($request->hasFile('logo')) {
            if ($skill->logo_public_id) {
                CloudinaryHelper::destroy($skill->logo_public_id);
            }
            $result                      = CloudinaryHelper::upload($request->file('logo'), 'portfolio/skills');
            $validated['logo']           = $result['secure_url'];
            $validated['logo_public_id'] = $result['public_id'];
        }

        $skill->update($validated);

        return response()->json([
            'message' => 'Skill updated successfully!',
            'skill'   => $skill
        ]);
    }

    public function destroy(string $id)
    {
        $skill = Skill::findOrFail($id);

        if ($skill->logo_public_id) {
            CloudinaryHelper::destroy($skill->logo_public_id);
        }

        $skill->delete();

        return response()->json([
            'success' => true,
            'message' => 'Skill deleted successfully!'
        ]);
    }
}