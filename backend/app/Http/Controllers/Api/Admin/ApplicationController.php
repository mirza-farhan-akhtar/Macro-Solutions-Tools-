<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = Application::with('career');

        if ($request->search) {
            $query->where('applicant_name', 'like', "%{$request->search}%")
                  ->orWhere('applicant_email', 'like', "%{$request->search}%");
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function show(Application $application)
    {
        return response()->json($application->load('career'));
    }

    public function update(Request $request, Application $application)
    {
        $request->validate([
            'status' => 'required|in:pending,reviewing,shortlisted,accepted,rejected',
        ]);

        $application->update(['status' => $request->status]);

        return response()->json($application);
    }

    public function destroy(Application $application)
    {
        $application->delete();
        return response()->json(['message' => 'Application deleted successfully']);
    }
}
