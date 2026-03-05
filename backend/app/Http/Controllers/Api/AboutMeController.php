<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutMe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AboutMeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $aboutMe = AboutMe::first();
        // Raha tiana hita ny URL feno an'ilay sary
        if ($aboutMe && $aboutMe->pdp) {
            $aboutMe->pdp = asset('storage/' . $aboutMe->pdp);
        }
        return response()->json($aboutMe);
    }

    /**
     * Store a newly created resource in storage.
     */
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
            // Delete taloha raha misy
            if ($aboutMe->pdp_public_id) {
                cloudinary()->destroy($aboutMe->pdp_public_id);
            }
            // Upload any Cloudinary
            $uploaded = cloudinary()->upload($request->file('pdp')->getRealPath());
            $validated['pdp'] = $uploaded->getSecurePath();
            $validated['pdp_public_id'] = $uploaded->getPublicId();
        }

        $validated['is_active'] = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
        $aboutMe->fill($validated);
        $aboutMe->save();

        return response()->json([
            'message' => 'Profile updated successfully!',
            'aboutMe' => $aboutMe
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
