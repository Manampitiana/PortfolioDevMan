<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $settings = Setting::first();
        return response()->json($settings);
    }

    public function store(Request $request)
    {
        return $this->update($request);
    }

    public function update(Request $request, $id = null)
    {
        $settings = Setting::firstOrCreate(['id' => 1]);

        $data = $request->validate([
            'site_name'        => 'nullable|string',
            'tagline'          => 'nullable|string',
            'theme_color'      => 'nullable|string',
            'meta_description' => 'nullable|string',
            'meta_keywords'    => 'nullable|string',
            'contact_email'    => 'nullable|email',
            'contact_phone'    => 'nullable|string',
            'social_links'     => 'nullable',
            'maintenance_mode' => 'nullable',
        ]);

        if ($request->has('social_links')) {
            $data['social_links'] = json_decode($request->social_links, true);
        }

        $data['maintenance_mode'] = filter_var($request->maintenance_mode, FILTER_VALIDATE_BOOLEAN);

        // --- LOGO — fafao taloha any Cloudinary, upload vaovao ---
        if ($request->hasFile('logo')) {
            if ($settings->logo_public_id) {
                cloudinary()->destroy($settings->logo_public_id);
            }
            $uploaded = cloudinary()->uploadFile($request->file('logo')->getRealPath(), [
                'folder' => 'portfolio/settings'
            ]);
            $data['logo']            = $uploaded->getSecurePath();
            $data['logo_public_id']  = $uploaded->getPublicId();
        }

        // --- FAVICON — fafao taloha any Cloudinary, upload vaovao ---
        if ($request->hasFile('favicon')) {
            if ($settings->favicon_public_id) {
                cloudinary()->destroy($settings->favicon_public_id);
            }
            $uploaded = cloudinary()->uploadFile($request->file('favicon')->getRealPath(), [
                'folder' => 'portfolio/settings'
            ]);
            $data['favicon']            = $uploaded->getSecurePath();
            $data['favicon_public_id']  = $uploaded->getPublicId();
        }

        $settings->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully!',
            'data'    => $settings
        ]);
    }
}
