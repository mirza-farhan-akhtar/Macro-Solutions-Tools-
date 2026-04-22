<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\FAQ;
use Illuminate\Http\Request;

class FAQController extends Controller
{
    public function index(Request $request)
    {
        $query = FAQ::query();

        if ($request->search) {
            $query->where('question', 'like', "%{$request->search}%");
        }

        return response()->json($query->orderBy('sort_order')->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'category' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'sort_order' => 'sometimes|integer',
        ]);

        $faq = FAQ::create($request->all());

        return response()->json($faq, 201);
    }

    public function show(FAQ $faq)
    {
        return response()->json($faq);
    }

    public function update(Request $request, FAQ $faq)
    {
        $request->validate([
            'question' => 'sometimes|string',
            'answer' => 'sometimes|string',
            'category' => 'nullable|string',
            'status' => 'sometimes|in:draft,published',
            'sort_order' => 'sometimes|integer',
        ]);

        $faq->update($request->all());

        return response()->json($faq);
    }

    public function destroy(FAQ $faq)
    {
        $faq->delete();
        return response()->json(['message' => 'FAQ deleted successfully']);
    }
}
