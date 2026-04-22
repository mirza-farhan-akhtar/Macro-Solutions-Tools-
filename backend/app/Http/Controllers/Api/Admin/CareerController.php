<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Career;
use Illuminate\Http\Request;

class CareerController extends Controller
{
    public function index(Request $request)
    {
        $query = Career::query();

        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'nullable|string',
            'location' => 'required|string',
            'type' => 'required|in:full-time,part-time,contract,remote',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'salary_range' => 'nullable|string',
            'experience_level' => 'nullable|string',
            'status' => 'required|in:active,inactive,open,closed',
            'deadline' => 'nullable|date',
        ]);

        $career = Career::create($request->all());

        return response()->json($career, 201);
    }

    public function show(Career $career)
    {
        return response()->json($career->load('applications'));
    }

    public function update(Request $request, Career $career)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'department' => 'nullable|string',
            'location' => 'sometimes|string',
            'type' => 'sometimes|in:full-time,part-time,contract,remote',
            'description' => 'sometimes|string',
            'requirements' => 'nullable|string',
            'salary_range' => 'nullable|string',
            'experience_level' => 'nullable|string',
            'status' => 'sometimes|in:active,inactive,open,closed',
            'deadline' => 'nullable|date',
        ]);

        $career->update($request->all());

        return response()->json($career);
    }

    public function destroy(Career $career)
    {
        $career->delete();
        return response()->json(['message' => 'Career deleted successfully']);
    }
}
