<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $query = Lead::with('assignedUser');

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
                  ->orWhere('company', 'like', "%{$request->search}%");
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'company' => 'nullable|string',
            'subject' => 'nullable|string',
            'message' => 'nullable|string',
            'source' => 'sometimes|string',
            'status' => 'required|in:new,contacted,qualified,converted,lost',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $lead = Lead::create($request->all());

        return response()->json($lead->load('assignedUser'), 201);
    }

    public function show(Lead $lead)
    {
        return response()->json($lead->load('assignedUser'));
    }

    public function update(Request $request, Lead $lead)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email',
            'phone' => 'nullable|string',
            'company' => 'nullable|string',
            'subject' => 'nullable|string',
            'message' => 'nullable|string',
            'source' => 'sometimes|string',
            'status' => 'sometimes|in:new,contacted,qualified,converted,lost',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $lead->update($request->all());

        return response()->json($lead->load('assignedUser'));
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();
        return response()->json(['message' => 'Lead deleted successfully']);
    }
}
