<?php

namespace App\Http\Controllers\API;

use App\Models\Proposal;
use App\Models\ProposalItem;
use App\Models\Deal;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProposalController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $this->authorizeAtLeast(['crm.proposal.manage', 'crm.dashboard']);

        $query = Proposal::with('client', 'deal', 'creator', 'items');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by client
        if ($request->has('client_id')) {
            $query->where('client_id', $request->input('client_id'));
        }

        // Filter by deal
        if ($request->has('deal_id')) {
            $query->where('deal_id', $request->input('deal_id'));
        }

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%$search%");
        }

        $perPage = $request->input('per_page', 15);
        $proposals = $query->paginate($perPage);

        return $this->respondWithPagination($proposals);
    }

    public function show($id): JsonResponse
    {
        $this->authorizeAtLeast(['crm.proposal.manage', 'crm.dashboard']);

        $proposal = Proposal::with('client', 'deal', 'creator', 'items')->findOrFail($id);

        return $this->respond([
            'data' => $proposal
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('crm.proposal.manage');

        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'deal_id' => 'nullable|exists:deals,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'total_amount' => 'required|numeric|min:0',
            'items' => 'nullable|array',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $proposal = Proposal::create([
            'client_id' => $validated['client_id'],
            'deal_id' => $validated['deal_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'total_amount' => $validated['total_amount'],
            'status' => 'draft',
            'created_by' => auth()->id(),
        ]);

        // Add items if provided
        if (!empty($validated['items'])) {
            foreach ($validated['items'] as $item) {
                ProposalItem::create([
                    'proposal_id' => $proposal->id,
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'amount' => $item['quantity'] * $item['unit_price'],
                ]);
            }
        }

        $proposal->load('items');

        return $this->respondCreated([
            'data' => $proposal
        ], 'Proposal created successfully');
    }

    public function update(Request $request, $id): JsonResponse
    {
        $this->authorize('crm.proposal.manage');

        $proposal = Proposal::findOrFail($id);

        if ($proposal->status !== 'draft') {
            return $this->respondUnprocessable('Can only edit draft proposals');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'total_amount' => 'required|numeric|min:0',
        ]);

        $proposal->update($validated);

        return $this->respond([
            'data' => $proposal
        ], 'Proposal updated successfully');
    }

    public function send(Request $request, $id): JsonResponse
    {
        $this->authorize('crm.proposal.manage');

        $proposal = Proposal::findOrFail($id);

        if ($proposal->status !== 'draft') {
            return $this->respondUnprocessable('Only draft proposals can be sent');
        }

        $proposal->markSent();

        return $this->respond([
            'data' => $proposal
        ], 'Proposal sent successfully');
    }

    public function accept(Request $request, $id): JsonResponse
    {
        $proposal = Proposal::findOrFail($id);

        if ($proposal->status === 'accepted') {
            return $this->respondUnprocessable('Proposal already accepted');
        }

        $proposal->markAccepted();

        // Update deal stage if associated
        if ($proposal->deal) {
            $proposal->deal->update(['stage' => 'negotiation']);
        }

        return $this->respond([
            'data' => $proposal
        ], 'Proposal accepted successfully');
    }

    public function reject(Request $request, $id): JsonResponse
    {
        $proposal = Proposal::findOrFail($id);

        if ($proposal->status === 'rejected') {
            return $this->respondUnprocessable('Proposal already rejected');
        }

        $proposal->markRejected();

        return $this->respond([
            'data' => $proposal
        ], 'Proposal rejected successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->authorize('crm.proposal.manage');

        $proposal = Proposal::findOrFail($id);

        if ($proposal->status !== 'draft') {
            return $this->respondUnprocessable('Can only delete draft proposals');
        }

        $proposal->delete();

        return $this->respond([], 'Proposal deleted successfully');
    }

    public function addItem(Request $request, $proposalId): JsonResponse
    {
        $this->authorize('crm.proposal.manage');

        $proposal = Proposal::findOrFail($proposalId);

        $validated = $request->validate([
            'description' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
        ]);

        $item = ProposalItem::create([
            'proposal_id' => $proposal->id,
            'description' => $validated['description'],
            'quantity' => $validated['quantity'],
            'unit_price' => $validated['unit_price'],
            'amount' => $validated['quantity'] * $validated['unit_price'],
        ]);

        return $this->respondCreated([
            'data' => $item
        ], 'Item added successfully');
    }
}
