<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AIService;
use Illuminate\Http\Request;

class AIServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = AIService::query();

        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        return response()->json($query->orderBy('sort_order')->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'slug'        => 'nullable|string|unique:ai_services,slug',
            'description' => 'nullable|string',
            'content'     => 'required|string',
            'icon'        => 'nullable|string',
            'status'      => 'required|in:draft,published',
            'sort_order'  => 'sometimes|integer',
        ]);

        $data = $request->all();
        if (empty($data['slug'])) {
            unset($data['slug']);
        }

        $service = AIService::create($data);

        return response()->json($service, 201);
    }

    public function show(AIService $aiService)
    {
        return response()->json($aiService);
    }

    public function update(Request $request, AIService $aiService)
    {
        $request->validate([
            'title'       => 'sometimes|string|max:255',
            'slug'        => 'nullable|string|unique:ai_services,slug,' . $aiService->id,
            'description' => 'nullable|string',
            'content'     => 'sometimes|string',
            'icon'        => 'nullable|string',
            'status'      => 'sometimes|in:draft,published',
            'sort_order'  => 'sometimes|integer',
        ]);

        $aiService->update($request->all());

        return response()->json($aiService);
    }

    public function destroy(AIService $aiService)
    {
        $aiService->delete();
        return response()->json(['message' => 'AI Service deleted successfully']);
    }
}
