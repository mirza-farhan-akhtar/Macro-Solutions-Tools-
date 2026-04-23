<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Interview;
use App\Models\Application;
use Illuminate\Http\Request;

class InterviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Interview::with(['application', 'interviewer']);

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by interview type
        if ($request->has('interview_type') && $request->interview_type) {
            $query->where('interview_type', $request->interview_type);
        }

        // Get upcoming interviews
        if ($request->has('upcoming') && $request->upcoming) {
            $query->where('scheduled_date', '>=', now());
        }

        $interviews = $query->orderBy('scheduled_date')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $interviews,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'application_id' => 'required|exists:applications,id',
            'scheduled_date' => 'required|date_format:Y-m-d H:i',
            'interview_type' => 'required|in:Phone,Video,In-Person',
            'description' => 'nullable|string',
        ]);

        $interview = Interview::create($validated);

        // Update application status
        Application::findOrFail($validated['application_id'])->update([
            'application_status' => 'Interview Scheduled',
            'interview_date' => $validated['scheduled_date'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Interview scheduled successfully',
            'data' => $interview,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $interview = Interview::findOrFail($id);

        $validated = $request->validate([
            'interview_notes' => 'nullable|string',
            'status' => 'sometimes|in:Scheduled,Completed,Cancelled,Rescheduled',
            'rating' => 'nullable|numeric|min:1|max:5',
            'outcome' => 'sometimes|in:Pass,Fail,Pending,On Hold',
        ]);

        $interview->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Interview updated successfully',
            'data' => $interview,
        ]);
    }

    public function completeInterview(Request $request, $id)
    {
        $interview = Interview::findOrFail($id);

        $validated = $request->validate([
            'interview_notes' => 'nullable|string',
            'rating' => 'required|numeric|min:1|max:5',
            'outcome' => 'required|in:Pass,Fail,Pending,On Hold',
        ]);

        $interview->update([
            'status' => 'Completed',
            'interview_notes' => $validated['interview_notes'],
            'rating' => $validated['rating'],
            'outcome' => $validated['outcome'],
        ]);

        // Update application status based on outcome
        if ($validated['outcome'] === 'Pass') {
            $interview->application->update(['application_status' => 'Shortlisted']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Interview completed successfully',
            'data' => $interview,
        ]);
    }
}
