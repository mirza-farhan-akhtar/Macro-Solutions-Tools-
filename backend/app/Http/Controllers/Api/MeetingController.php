<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth()->id();

        $query = Meeting::with('organizer:id,name,email')
                        ->orderBy('meeting_date', 'asc')
                        ->orderBy('meeting_time', 'asc');

        // For non-superadmin / non-admin: only show meetings they are invited to or organise
        // Super-admin and admin see all
        $user      = auth()->user();
        $isSuperAdmin = $user->hasRole('super-admin') || $user->hasRole('admin');
        if (!$isSuperAdmin) {
            $query->where(function ($q) use ($userId) {
                $q->where('organizer_id', $userId)
                  ->orWhereJsonContains('attendee_user_ids', $userId);
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from') && $request->date_from) {
            $query->where('meeting_date', '>=', $request->date_from);
        }

        if ($request->has('search') && $request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $meetings = $query->paginate($request->get('per_page', 20));

        return response()->json(['success' => true, 'data' => $meetings]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'                  => 'required|string|max:255',
            'description'            => 'nullable|string',
            'meeting_date'           => 'required|date',
            'meeting_time'           => 'required',
            'duration'               => 'nullable|integer|min:5',
            'location'               => 'nullable|string|max:255',
            'meeting_link'           => 'nullable|string|max:500',
            'status'                 => 'nullable|in:Scheduled,In Progress,Completed,Cancelled',
            'attendee_user_ids'      => 'nullable|array',
            'attendee_employee_ids'  => 'nullable|array',
        ]);

        $validated['organizer_id']        = auth()->id();
        $validated['status']              = $validated['status'] ?? 'Scheduled';
        $validated['attendee_user_ids']   = $validated['attendee_user_ids'] ?? [];
        $validated['attendee_employee_ids'] = $validated['attendee_employee_ids'] ?? [];

        $meeting = Meeting::create($validated);
        $meeting->load('organizer:id,name,email');

        return response()->json([
            'success' => true,
            'message' => 'Meeting created successfully',
            'data'    => $meeting,
        ], 201);
    }

    public function show($id)
    {
        $meeting = Meeting::with('organizer:id,name,email')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $meeting]);
    }

    public function update(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);

        $validated = $request->validate([
            'title'                  => 'sometimes|required|string|max:255',
            'description'            => 'nullable|string',
            'meeting_date'           => 'sometimes|required|date',
            'meeting_time'           => 'sometimes|required',
            'duration'               => 'nullable|integer|min:5',
            'location'               => 'nullable|string|max:255',
            'meeting_link'           => 'nullable|string|max:500',
            'status'                 => 'nullable|in:Scheduled,In Progress,Completed,Cancelled',
            'attendee_user_ids'      => 'nullable|array',
            'attendee_employee_ids'  => 'nullable|array',
        ]);

        $meeting->update($validated);
        $meeting->load('organizer:id,name,email');

        return response()->json([
            'success' => true,
            'message' => 'Meeting updated successfully',
            'data'    => $meeting,
        ]);
    }

    public function destroy($id)
    {
        $meeting = Meeting::findOrFail($id);
        $meeting->delete();

        return response()->json(['success' => true, 'message' => 'Meeting deleted']);
    }

    /**
     * GET /employee/meetings  — employee sees only their own meetings
     */
    public function myMeetings(Request $request)
    {
        $userId = auth()->id();

        $meetings = Meeting::with('organizer:id,name,email')
            ->where(function ($q) use ($userId) {
                $q->where('organizer_id', $userId)
                  ->orWhereJsonContains('attendee_user_ids', $userId);
            })
            ->orderBy('meeting_date', 'asc')
            ->orderBy('meeting_time', 'asc')
            ->get();

        return response()->json(['success' => true, 'data' => $meetings]);
    }
}
