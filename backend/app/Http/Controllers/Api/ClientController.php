<?php

namespace App\Http\Controllers\API;

use App\Models\Client;
use App\Models\Contact;
use App\Models\Deal;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClientController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $this->authorizeAtLeast(['crm.client.manage', 'crm.dashboard']);

        $query = Client::with('assignedManager', 'contacts', 'deals');

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('company_name', 'like', "%$search%")
                  ->orWhere('industry', 'like', "%$search%")
                  ->orWhere('website', 'like', "%$search%");
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by manager
        if ($request->has('assigned_account_manager')) {
            $query->where('assigned_account_manager', $request->input('assigned_account_manager'));
        }

        $perPage = $request->input('per_page', 15);
        $clients = $query->paginate($perPage);

        return $this->respondWithPagination($clients);
    }

    public function show($id): JsonResponse
    {
        $this->authorizeAtLeast(['crm.client.manage', 'crm.dashboard']);

        $client = Client::with('assignedManager', 'contacts', 'deals.assignedUser', 'invoices', 'lead')->findOrFail($id);

        return $this->respond([
            'data' => [
                'client' => $client,
                'revenueTotal' => $client->deals()->won()->sum('value'),
                'activeDeals' => $client->deals()->whereNotIn('stage', ['won', 'lost'])->count(),
                'contacts' => $client->contacts()->count(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('crm.client.manage');

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'industry' => 'nullable|string|max:100',
            'website' => 'nullable|url',
            'tax_id' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'assigned_account_manager' => 'nullable|exists:users,id',
            'status' => 'required|in:active,inactive',
            'notes' => 'nullable|string',
            'lead_id' => 'nullable|exists:leads,id',
        ]);

        $client = Client::create($validated);

        return $this->respondCreated([
            'data' => $client
        ], 'Client created successfully');
    }

    public function update(Request $request, $id): JsonResponse
    {
        $this->authorize('crm.client.manage');

        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'industry' => 'nullable|string|max:100',
            'website' => 'nullable|url',
            'tax_id' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'assigned_account_manager' => 'nullable|exists:users,id',
            'status' => 'required|in:active,inactive',
            'notes' => 'nullable|string',
        ]);

        $client->update($validated);

        return $this->respond([
            'data' => $client
        ], 'Client updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->authorize('crm.client.manage');

        $client = Client::findOrFail($id);
        $client->delete();

        return $this->respond([], 'Client deleted successfully');
    }

    public function contacts($clientId): JsonResponse
    {
        $this->authorizeAtLeast(['crm.client.manage', 'crm.contact.manage']);

        $client = Client::findOrFail($clientId);
        $contacts = $client->contacts()->get();

        return $this->respond([
            'data' => $contacts
        ]);
    }

    public function deals($clientId): JsonResponse
    {
        $this->authorizeAtLeast(['crm.client.manage', 'crm.deal.manage']);

        $client = Client::findOrFail($clientId);
        $deals = $client->deals()->with('assignedUser')->get();

        return $this->respond([
            'data' => $deals
        ]);
    }

    public function invoices($clientId): JsonResponse
    {
        $this->authorizeAtLeast(['crm.client.manage', 'crm.dashboard']);

        $client = Client::findOrFail($clientId);
        $invoices = $client->invoices()->with('items')->get();

        return $this->respond([
            'data' => $invoices
        ]);
    }
}
