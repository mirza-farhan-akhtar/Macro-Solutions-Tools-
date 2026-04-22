<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PerformanceReview;
use Illuminate\Http\Request;

class PerformanceReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = PerformanceReview::with(['employee', 'reviewer']);

        // Filter by employee
        if ($request->has('employee_id') && $request->employee_id) {
            $query->where('employee_id', $request->employee_id);
        }

        // Filter by review period
        if ($request->has('review_period') && $request->review_period) {
            $query->where('review_period', $request->review_period);
        }

        $reviews = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $reviews,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'review_period' => 'required|string',
            'rating' => 'required|numeric|min:1|max:5',
            'comments' => 'required|string',
            'strengths' => 'nullable|string',
            'areas_for_improvement' => 'nullable|string',
            'improvement_notes' => 'nullable|string',
        ]);

        $validated['reviewer_id'] = auth()->id();
        $validated['status'] = 'Draft';

        $review = PerformanceReview::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Performance review created successfully',
            'data' => $review,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $review = PerformanceReview::findOrFail($id);

        $validated = $request->validate([
            'rating' => 'sometimes|numeric|min:1|max:5',
            'comments' => 'sometimes|string',
            'strengths' => 'nullable|string',
            'areas_for_improvement' => 'nullable|string',
            'improvement_notes' => 'nullable|string',
            'status' => 'sometimes|in:Draft,Submitted,Reviewed,Acknowledged',
        ]);

        $review->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Performance review updated successfully',
            'data' => $review,
        ]);
    }

    public function getDepartmentStats($department)
    {
        $stats = PerformanceReview::whereHas('employee', fn($q) => $q->where('department', $department))
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as total_reviews')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'department' => $department,
                'average_rating' => $stats->avg_rating ?? 0,
                'total_reviews' => $stats->total_reviews ?? 0,
            ],
        ]);
    }
}
