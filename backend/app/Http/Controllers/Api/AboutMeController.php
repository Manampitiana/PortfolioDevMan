<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\CloudinaryHelper;
use App\Models\AboutMe;
use Illuminate\Http\Request;

class AboutMeController extends Controller
{
    public function index()
    {
        $aboutMe = AboutMe::first();
        return response()->json($aboutMe);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name'   => 'required|string|max:255',
            'title'       => 'required|string|max:255',
            'short_bio'   => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'email'       => 'required|email',
            'phone'       => 'nullable|string',
            'location'    => 'nullable|string',
            'is_active'   => 'required',
            'pdp'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:8048',
        ]);

        $aboutMe = AboutMe::first() ?? new AboutMe();

        if ($request->hasFile('pdp')) {
            if ($aboutMe->pdp_public_id) {
                CloudinaryHelper::destroy($aboutMe->pdp_public_id);
            }
            $result                     = CloudinaryHelper::upload($request->file('pdp'), 'portfolio/about');
            $validated['pdp']           = $result['secure_url'];
            $validated['pdp_public_id'] = $result['public_id'];
        }

        $validated['is_active'] = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
        $aboutMe->fill($validated);
        $aboutMe->save();

        return response()->json([
            'message' => 'Profile updated successfully!',
            'aboutMe' => $aboutMe
        ], 200);
    }

    public function show(string $id) {}
    public function update(Request $request, string $id) {}
    public function destroy(string $id) {}
}