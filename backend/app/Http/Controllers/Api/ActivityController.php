<?php

namespace App\Http\Controllers\Api;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class ActivityController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $this->authorizeAtLeast(['crm.activity.manage', 'crm.dashboard']);

        $query = Activity::with('creator', 'assignedUser');

        // Filter by type
        if ($request->has('related_type')) {
            $query->where('related_type', $request->input('related_type'));
        }

        // Filter by id
        if ($request->has('related_id')) {
            $query->where('related_id', $request->input('related_id'));
        }

        // Filter by activity type
        if ($request->has('activity_type')) {
            $query->where('activity_type', $request->input('activity_type'));
        }

        // Show only incomplete
        if ($request->boolean('incomplete')) {
            $query->where('completed', false);
        }

        // Show only overdue
        if ($request->boolean('overdue')) {
            $query->overdue();
        }

        $query->orderBy('created_at', 'desc');
        $perPage = $request->input('per_page', 15);
        $activities = $query->paginate($perPage);

        return $this->respondWithPagination($activities);
    }

    public function show($id): JsonResponse
    {
        $this->authorizeAtLeast(['crm.activity.manage', 'crm.dashboard']);

        $activity = Activity::with('creator', 'assignedUser')->findOrFail($id);

        return $this->respond([
            'data' => $activity
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('crm.activity.manage');

        $validated = $request->validate([
            'related_type' => 'required|in:Lead,Deal,Client',
            'related_id' => 'required|integer',
            'activity_type' => 'required|in:call,email,meeting,note,task,follow_up',
            'description' => 'required|string',
            'scheduled_at' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        // Parse scheduled_at if provided
        $scheduledAt = null;
        if (!empty($validated['scheduled_at'])) {
            try {
                $scheduledAt = Carbon::parse($validated['scheduled_at']);
            } catch (\Exception $e) {
                return $this->respondValidationError(['scheduled_at' => 'Invalid date format']);
            }
        }

        $activity = Activity::create([
            'related_type' => $validated['related_type'],
            'related_id' => $validated['related_id'],
            'activity_type' => $validated['activity_type'],
            'description' => $validated['description'],
            'scheduled_at' => $scheduledAt,
            'created_by' => auth()->id(),
            'assigned_to' => $validated['assigned_to'] ?? null,
        ]);

        return $this->respondCreated([
            'data' => $activity
        ], 'Activity created successfully');
    }

    public function update(Request $request, $id): JsonResponse
    {
        $this->authorize('crm.activity.manage');

        $activity = Activity::findOrFail($id);

        $validated = $request->validate([
            'description' => 'required|string',
            'activity_type' => 'required|in:call,email,meeting,note,task,follow_up',
            'scheduled_at' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        // Parse scheduled_at if provided
        $scheduledAt = $activity->scheduled_at;
        if (!empty($validated['scheduled_at'])) {
            try {
                $scheduledAt = Carbon::parse($validated['scheduled_at']);
            } catch (\Exception $e) {
                return $this->respondValidationError(['scheduled_at' => 'Invalid date format']);
            }
        } elseif ($validated['scheduled_at'] === null) {
            $scheduledAt = null;
        }

        $validated['scheduled_at'] = $scheduledAt;
        $activity->update($validated);

        return $this->respond([
            'data' => $activity
        ], 'Activity updated successfully');
    }

    public function complete(Request $request, $id): JsonResponse
    {
        $this->authorize('crm.activity.manage');

        $activity = Activity::findOrFail($id);
        $activity->markComplete();

        return $this->respond([
            'data' => $activity
        ], 'Activity marked as complete');
    }

    public function destroy($id): JsonResponse
    {
        $this->authorize('crm.activity.manage');

        $activity = Activity::findOrFail($id);
        $activity->delete();

        return $this->respond([], 'Activity deleted successfully');
    }

    public function forLead($leadId): JsonResponse
    {
        $this->authorizeAtLeast(['crm.activity.manage', 'crm.dashboard']);

        $activities = Activity::forLead($leadId)
            ->with('creator', 'assignedUser')
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->respond([
            'data' => $activities
        ]);
    }

    public function forDeal($dealId): JsonResponse
    {
        $this->authorizeAtLeast(['crm.activity.manage', 'crm.dashboard']);

        $activities = Activity::forDeal($dealId)
            ->with('creator', 'assignedUser')
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->respond([
            'data' => $activities
        ]);
    }

    public function forClient($clientId): JsonResponse
    {
        $this->authorizeAtLeast(['crm.activity.manage', 'crm.dashboard']);

        $activities = Activity::forClient($clientId)
            ->with('creator', 'assignedUser')
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->respond([
            'data' => $activities
        ]);
    }

    public function overdue(): JsonResponse
    {
        $this->authorizeAtLeast(['crm.activity.manage', 'crm.dashboard']);

        $activities = Activity::overdue()
            ->with('creator', 'assignedUser')
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return $this->respond([
            'data' => $activities,
            'count' => count($activities)
        ]);
    }
}
