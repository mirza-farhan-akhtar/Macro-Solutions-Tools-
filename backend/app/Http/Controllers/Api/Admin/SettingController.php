<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all();
        return response()->json([
            'data' => $settings->pluck('value', 'key')
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($request->settings as $key => $value) {
            Setting::setValue($key, $value);
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function updateBulk(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            if ($key !== '_token') {
                Setting::setValue($key, $value);
            }
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
