<?php

namespace App\Http\Controllers\API;

use App\Models\Lead;
use App\Models\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LeadController extends BaseController
{
    /**
     * Get all CRM leads with filters
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorizeAtLeast(['crm.lead.manage', 'crm.dashboard']);

        $query = Lead::query();

        // Filter by status (lead_status field)
        if ($request->has('status')) {
            $query->byStatus($request->status);
        }

        // Filter by priority
        if ($request->has('priority')) {
            $query->byPriority($request->priority);
        }

        // Filter by source
        if ($request->has('source')) {
            $query->bySource($request->source);
        }

        // Filter by assigned user
        if ($request->has('assigned_to')) {
            $query->byUser($request->assigned_to);
        }

        // Only qualified leads
        if ($request->boolean('qualified')) {
            $query->qualified();
        }

        // Filter by incomplete status
        if ($request->boolean('incomplete')) {
            $query->whereNotIn('lead_status', ['won', 'lost']);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%")
                    ->orWhere('company_name', 'like', "%$search%");
            });
        }

        $leads = $query->with(['assignedUser', 'deals', 'activities'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return $this->respondWithPagination($leads);
    }

    /**
     * Get a single lead
     */
    public function show(Lead $lead): JsonResponse
    {
        $this->authorizeAtLeast(['crm.lead.manage', 'crm.dashboard']);
        
        $lead->load(['assignedUser', 'deals', 'activities', 'client']);

        return $this->respond(['data' => $lead]);
    }

    /**
     * Create a new lead
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('crm.lead.manage');
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:leads,email',
            'phone' => 'nullable|string',
            'company_name' => 'nullable|string',
            'industry' => 'nullable|string',
            'budget_range' => 'nullable|string',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'lead_status' => 'nullable|in:new,contacted,qualified,proposal_sent,negotiation,won,lost',
            'source' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'tags' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $lead = Lead::create($validated);
        $lead->load(['assignedUser']);

        return $this->respondCreated(['data' => $lead], 'Lead created successfully');
    }

    /**
     * Update a lead
     */
    public function update(Request $request, Lead $lead): JsonResponse
    {
        $this->authorize('crm.lead.manage');
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:leads,email,' . $lead->id,
            'phone' => 'nullable|string',
            'company_name' => 'nullable|string',
            'industry' => 'nullable|string',
            'budget_range' => 'nullable|string',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'lead_status' => 'nullable|in:new,contacted,qualified,proposal_sent,negotiation,won,lost',
            'source' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'tags' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $lead->update($validated);
        $lead->load(['assignedUser']);

        return $this->respond(['data' => $lead], 'Lead updated successfully');
    }

    /**
     * Delete a lead
     */
    public function destroy(Lead $lead): JsonResponse
    {
        $this->authorize('crm.lead.manage');
        
        // Delete related deals and activities
        $lead->deals()->delete();
        $lead->activities()->delete();

        $lead->delete();

        return $this->respond([], 'Lead deleted successfully');
    }

    /**
     * Convert a lead to a client
     */
    public function convertToClient(Lead $lead): JsonResponse
    {
        $this->authorize('crm.lead.manage');
        
        // Check if already converted
        if ($lead->client_id) {
            abort(400, 'Lead is already converted to a client');
        }

        // Create a new client from the lead
        $client = Client::create([
            'company_name' => $lead->company_name ?? $lead->name,
            'industry' => $lead->industry,
            'assigned_account_manager' => $lead->assigned_to,
            'status' => 'active',
            'notes' => $lead->notes,
        ]);

        // Update the lead with the client_id
        $lead->update([
            'client_id' => $client->id,
            'lead_status' => 'won',
        ]);

        return $this->respond([
            'lead' => $lead,
            'client' => $client,
        ], 'Lead converted to client successfully');
    }
}
