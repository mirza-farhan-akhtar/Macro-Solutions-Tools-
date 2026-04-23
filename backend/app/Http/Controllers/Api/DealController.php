<?php

namespace App\Http\Controllers\Api;

use App\Models\Deal;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\Income;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DealController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $this->authorizeAtLeast(['crm.deal.manage', 'crm.dashboard']);

        $query = Deal::with('client', 'lead', 'assignedUser');

        // Filter by stage (for pipeline view)
        if ($request->has('stage')) {
            $query->where('stage', $request->input('stage'));
        }

        // Filter by user
        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->input('assigned_to'));
        }

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('deal_name', 'like', "%$search%")
                  ->orWhereHas('client', function ($q) use ($search) {
                      $q->where('company_name', 'like', "%$search%");
                  });
        }

        $perPage = $request->input('per_page', 15);
        $deals = $query->paginate($perPage);

        return $this->respondWithPagination($deals);
    }

    public function pipeline(Request $request): JsonResponse
    {
        $this->authorizeAtLeast(['crm.deal.manage', 'crm.dashboard']);

        $stages = ['qualification', 'proposal', 'negotiation', 'won', 'lost'];
        $pipeline = [];

        foreach ($stages as $stage) {
            $deals = Deal::where('stage', $stage)
                ->with('client', 'assignedUser')
                ->get();

            $pipeline[$stage] = [
                'stage' => $stage,
                'deals' => $deals,
                'total_value' => $deals->sum('value'),
                'count' => $deals->count(),
            ];
        }

        return $this->respond([
            'data' => $pipeline
        ]);
    }

    public function show($id): JsonResponse
    {
        $this->authorizeAtLeast(['crm.deal.manage', 'crm.dashboard']);

        $deal = Deal::with('client', 'lead', 'assignedUser', 'proposals', 'activities')->findOrFail($id);

        return $this->respond([
            'data' => $deal
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('crm.deal.manage');

        $validated = $request->validate([
            'deal_name' => 'required|string|max:255',
            'client_id' => 'required|exists:clients,id',
            'lead_id' => 'nullable|exists:leads,id',
            'value' => 'required|numeric|min:0',
            'stage' => 'required|in:qualification,proposal,negotiation,won,lost',
            'probability' => 'required|integer|min:0|max:100',
            'expected_closing_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $deal = Deal::create($validated);

        return $this->respondCreated([
            'data' => $deal
        ], 'Deal created successfully');
    }

    public function update(Request $request, $id): JsonResponse
    {
        $this->authorize('crm.deal.manage');

        $deal = Deal::findOrFail($id);

        $validated = $request->validate([
            'deal_name' => 'required|string|max:255',
            'value' => 'required|numeric|min:0',
            'stage' => 'required|in:qualification,proposal,negotiation,won,lost',
            'probability' => 'required|integer|min:0|max:100',
            'expected_closing_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $oldStage = $deal->stage;
        $deal->update($validated);

        // If moved to Won stage, create invoice draft + income record
        if ($oldStage !== 'won' && $deal->stage === 'won') {
            $this->createInvoiceDraftFromDeal($deal);
            $this->createIncomeFromDeal($deal);
        }

        return $this->respond([
            'data' => $deal
        ], 'Deal updated successfully');
    }

    public function markWon(Request $request, $id): JsonResponse
    {
        $this->authorize('crm.deal.manage');

        $deal = Deal::findOrFail($id);
        $deal->markWon();

        // Create invoice draft + income record for Finance dashboard
        $this->createInvoiceDraftFromDeal($deal);
        $this->createIncomeFromDeal($deal);

        return $this->respond([
            'data' => $deal
        ], 'Deal won! Invoice draft created.');
    }

    public function markLost(Request $request, $id): JsonResponse
    {
        $this->authorize('crm.deal.manage');

        $validated = $request->validate([
            'lost_reason' => 'nullable|string',
        ]);

        $deal = Deal::findOrFail($id);
        $deal->markLost($validated['lost_reason'] ?? null);

        return $this->respond([
            'data' => $deal
        ], 'Deal marked as lost');
    }

    public function destroy($id): JsonResponse
    {
        $this->authorize('crm.deal.manage');

        $deal = Deal::findOrFail($id);
        $deal->delete();

        return $this->respond([], 'Deal deleted successfully');
    }

    private function createInvoiceDraftFromDeal(Deal $deal): void
    {
        // Create a draft invoice for the won deal
        Invoice::create([
            'invoice_number' => 'DRAFT-' . now()->timestamp,
            'client_id' => $deal->client_id,
            'subtotal' => $deal->value,
            'tax_amount' => 0,
            'discount_amount' => 0,
            'total_amount' => $deal->value,
            'status' => 'draft',
            'due_date' => now()->addDays(30),
            'issued_date' => now(),
        ]);
    }

    private function createIncomeFromDeal(Deal $deal): void
    {
        // firstOrCreate prevents duplicates if won is triggered more than once
        Income::firstOrCreate(
            ['transaction_reference' => 'DEAL-' . $deal->id],
            [
                'client_id'           => $deal->client_id,
                'source'              => 'crm_deal',
                'amount'              => $deal->value,
                'payment_method'      => 'bank_transfer',
                'received_at'         => $deal->won_date ?? now(),
                'status'              => 'completed',
                'notes'               => 'Won deal: ' . $deal->deal_name,
            ]
        );
    }
}
