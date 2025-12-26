<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
        // Antsoina ny update fa tsy asiana ID
        return $this->update($request);
    }

    public function update(Request $request, $id = null)
    {
        $settings = Setting::firstOrCreate(['id' => 1]);

        $data = $request->validate([
            'site_name' => 'nullable|string',
            'tagline' => 'nullable|string',
            'theme_color' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'social_links' => 'nullable', 
            'maintenance_mode' => 'nullable',
        ]);

        if ($request->has('social_links')) {
            $data['social_links'] = json_decode($request->social_links, true);
        }

        $data['maintenance_mode'] = filter_var($request->maintenance_mode, FILTER_VALIDATE_BOOLEAN);

        // --- 3. Fitantanana ny LOGO (miaraka amin'ny famafana ny taloha) ---
        if ($request->hasFile('logo')) {
            // Raha efa nisy logo taloha, dia fafao izany ao amin'ny storage
            if ($settings->logo && Storage::disk('public')->exists($settings->logo)) {
                Storage::disk('public')->delete($settings->logo);
            }
            // Tehirizo ilay logo vaovao
            $data['logo'] = $request->file('logo')->store('settings', 'public');
        }
        
        // --- 4. Fitantanana ny FAVICON (miaraka amin'ny famafana ny taloha) ---
        if ($request->hasFile('favicon')) {
            // Raha efa nisy favicon taloha, dia fafao izany
            if ($settings->favicon && Storage::disk('public')->exists($settings->favicon)) {
                Storage::disk('public')->delete($settings->favicon);
            }
            // Tehirizo ilay favicon vaovao
            $data['favicon'] = $request->file('favicon')->store('settings', 'public');
        }

        $settings->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully!', 
            'data' => $settings
        ]);
    }
}
