<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(Request $request)
    {
        $query = TeamMember::query();

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        return response()->json($query->orderBy('sort_order')->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'joining_date' => 'nullable|date',
            'birthday' => 'nullable|date|before:today',
            'bio' => 'nullable|string',
            'avatar' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'salary' => 'nullable|numeric|min:0',
            'employee_id' => 'nullable|string|max:50|unique:team_members,employee_id',
            'employment_type' => 'nullable|in:full-time,part-time,contract,intern',
            'experience_level' => 'nullable|string|max:100',
            'skills' => 'nullable|array',
            'education' => 'nullable|string|max:500',
            'achievements' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'linkedin' => 'nullable|url',
            'twitter' => 'nullable|string',
            'instagram' => 'nullable|string',
            'github' => 'nullable|url',
            'portfolio_url' => 'nullable|url',
            'status' => 'required|in:active,inactive',
            'sort_order' => 'sometimes|integer',
        ]);

        $teamMember = TeamMember::create($request->all());

        return response()->json($teamMember, 201);
    }

    public function show(TeamMember $team)
    {
        return response()->json($team);
    }

    public function update(Request $request, TeamMember $team)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'position' => 'sometimes|string|max:255',
            'department' => 'nullable|string|max:255',
            'joining_date' => 'nullable|date',
            'birthday' => 'nullable|date|before:today',
            'bio' => 'nullable|string',
            'avatar' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'salary' => 'nullable|numeric|min:0',
            'employee_id' => 'nullable|string|max:50|unique:team_members,employee_id,' . $team->id,
            'employment_type' => 'nullable|in:full-time,part-time,contract,intern',
            'experience_level' => 'nullable|string|max:100',
            'skills' => 'nullable|array',
            'education' => 'nullable|string|max:500',
            'achievements' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'linkedin' => 'nullable|url',
            'twitter' => 'nullable|string',
            'instagram' => 'nullable|string',
            'github' => 'nullable|url',
            'portfolio_url' => 'nullable|url',
            'status' => 'sometimes|in:active,inactive',
            'sort_order' => 'sometimes|integer',
        ]);

        $team->update($request->all());

        return response()->json($team);
    }

    public function destroy(TeamMember $team)
    {
        $team->delete();
        return response()->json(['message' => 'Team member deleted successfully']);
    }
}
