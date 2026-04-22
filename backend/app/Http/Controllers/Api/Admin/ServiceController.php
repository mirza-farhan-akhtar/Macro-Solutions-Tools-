<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query();

        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        return response()->json($query->orderBy('sort_order')->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'         => 'required|string|max:255',
            'excerpt'       => 'nullable|string',
            'content'       => 'required|string',
            'icon'          => 'nullable|string',
            'image'         => 'nullable|image|max:4096',
            'status'        => 'required|in:draft,published',
            'sort_order'    => 'sometimes|integer',
            'slug'          => 'nullable|string|unique:services,slug',
            'features'      => 'nullable',
            'benefits'      => 'nullable',
            'process_steps' => 'nullable',
            'technologies'  => 'nullable',
        ]);

        $data = $request->except('image');

        // Ensure slug is cleared so the model boot generates a unique one from title
        if (empty($data['slug'])) {
            unset($data['slug']);
        }

        // Decode JSON strings (sent via FormData)
        foreach (['features', 'benefits', 'process_steps', 'technologies'] as $field) {
            if (isset($data[$field]) && is_string($data[$field])) {
                $decoded = json_decode($data[$field], true);
                $data[$field] = is_array($decoded) ? array_values(array_filter($decoded, fn($v) => $v !== '')) : null;
            }
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('services', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $service = Service::create($data);

        return response()->json($service, 201);
    }

    public function show(Service $service)
    {
        return response()->json($service);
    }

    public function update(Request $request, Service $service)
    {
        $request->validate([
            'title'         => 'sometimes|string|max:255',
            'excerpt'       => 'nullable|string',
            'content'       => 'sometimes|string',
            'icon'          => 'nullable|string',
            'image'         => 'nullable|image|max:4096',
            'status'        => 'sometimes|in:draft,published',
            'sort_order'    => 'sometimes|integer',
            'slug'          => 'nullable|string|unique:services,slug,' . $service->id,
            'features'      => 'nullable',
            'benefits'      => 'nullable',
            'process_steps' => 'nullable',
            'technologies'  => 'nullable',
        ]);

        $data = $request->except(['image', '_method']);

        // Decode JSON strings (sent via FormData)
        foreach (['features', 'benefits', 'process_steps', 'technologies'] as $field) {
            if (isset($data[$field]) && is_string($data[$field])) {
                $decoded = json_decode($data[$field], true);
                $data[$field] = is_array($decoded) ? array_values(array_filter($decoded, fn($v) => $v !== '')) : null;
            }
        }

        if ($request->hasFile('image')) {
            if ($service->image && str_starts_with($service->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $service->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('services', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $service->update($data);

        return response()->json($service);
    }

    public function destroy(Service $service)
    {
        if ($service->image && str_starts_with($service->image, '/storage/')) {
            $path = str_replace('/storage/', '', $service->image);
            Storage::disk('public')->delete($path);
        }
        $service->delete();
        return response()->json(['message' => 'Service deleted successfully']);
    }
}

