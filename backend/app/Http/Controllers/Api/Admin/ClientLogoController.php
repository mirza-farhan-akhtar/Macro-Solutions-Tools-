<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClientLogo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ClientLogoController extends Controller
{
    public function index(Request $request)
    {
        $query = ClientLogo::ordered();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('industry', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $logos = $query->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $logos,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'logo_url' => 'nullable|url',
            'website_url' => 'nullable|url',
            'industry' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $request->only(['name', 'logo_url', 'website_url', 'industry', 'description', 'sort_order']);
        $data['is_featured'] = $request->boolean('is_featured', false);
        $data['is_active'] = $request->boolean('is_active', true);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('client-logos', 'public');
            $data['logo_path'] = $path;
            unset($data['logo_url']);
        }

        $logo = ClientLogo::create($data);

        return response()->json([
            'success' => true,
            'data' => $logo,
            'message' => 'Client logo created successfully',
        ], 201);
    }

    public function show(ClientLogo $clientLogo)
    {
        return response()->json(['success' => true, 'data' => $clientLogo]);
    }

    public function update(Request $request, ClientLogo $clientLogo)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'logo_url' => 'nullable|url',
            'website_url' => 'nullable|url',
            'industry' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $request->only(['name', 'logo_url', 'website_url', 'industry', 'description', 'sort_order']);
        if ($request->has('is_featured')) $data['is_featured'] = $request->boolean('is_featured');
        if ($request->has('is_active')) $data['is_active'] = $request->boolean('is_active');

        if ($request->hasFile('logo')) {
            // Delete old logo if stored
            if ($clientLogo->logo_path) {
                Storage::disk('public')->delete($clientLogo->logo_path);
            }
            $path = $request->file('logo')->store('client-logos', 'public');
            $data['logo_path'] = $path;
            $data['logo_url'] = null;
        }

        $clientLogo->update($data);

        return response()->json([
            'success' => true,
            'data' => $clientLogo->fresh(),
            'message' => 'Client logo updated successfully',
        ]);
    }

    public function destroy(ClientLogo $clientLogo)
    {
        if ($clientLogo->logo_path) {
            Storage::disk('public')->delete($clientLogo->logo_path);
        }
        $clientLogo->delete();

        return response()->json(['success' => true, 'message' => 'Client logo deleted successfully']);
    }

    public function reorder(Request $request)
    {
        $items = $request->validate(['items' => 'required|array', 'items.*.id' => 'required|integer', 'items.*.sort_order' => 'required|integer']);

        foreach ($request->items as $item) {
            ClientLogo::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['success' => true, 'message' => 'Order updated']);
    }
}
