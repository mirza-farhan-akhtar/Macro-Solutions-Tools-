<?php

namespace App\Http\Controllers\Finance;

use App\Models\Income;
use App\Models\Invoice;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;

class IncomeController extends Controller
{
    /**
     * Display a listing of incomes
     * GET /api/finance/incomes
     */
    public function index(Request $request)
    {
        try {
            $query = Income::with(['client:id,name', 'invoice:id,invoice_number'])
                ->orderBy('received_at', 'desc');

            // Filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('source')) {
                $query->where('source', $request->source);
            }

            if ($request->has('client_id')) {
                $query->where('client_id', $request->client_id);
            }

            if ($request->has('payment_method')) {
                $query->where('payment_method', $request->payment_method);
            }

            if ($request->has('date_from')) {
                $query->whereDate('received_at', '>=', $request->date_from);
            }

            if ($request->has('date_to')) {
                $query->whereDate('received_at', '<=', $request->date_to);
            }

            if ($request->has('min_amount')) {
                $query->where('amount', '>=', $request->min_amount);
            }

            if ($request->has('max_amount')) {
                $query->where('amount', '<=', $request->max_amount);
            }

            $incomes = $query->paginate($request->per_page ?? 15);

            return response()->json([
                'success' => true,
                'data' => $incomes,
                'message' => 'Incomes retrieved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving incomes: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created income
     * POST /api/finance/incomes
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'client_id' => 'nullable|exists:applications,id',
                'invoice_id' => 'nullable|exists:invoices,id',
                'source' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0.01',
                'payment_method' => 'required|in:bank_transfer,credit_card,cash,check,other',
                'transaction_reference' => 'required|string|unique:incomes',
                'received_at' => 'required|date|before_or_equal:today',
                'notes' => 'nullable|string',
            ]);

            $income = Income::create([
                'client_id' => $validated['client_id'] ?? null,
                'invoice_id' => $validated['invoice_id'] ?? null,
                'source' => $validated['source'],
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'transaction_reference' => $validated['transaction_reference'],
                'received_at' => $validated['received_at'],
                'notes' => $validated['notes'] ?? null,
                'status' => 'completed',
            ]);

            // If linked to invoice, update invoice payment status
            if ($validated['invoice_id'] ?? null) {
                $invoice = Invoice::find($validated['invoice_id']);
                if ($invoice) {
                    $totalPaid = $invoice->payments()->sum('amount') + $validated['amount'];
                    if ($totalPaid >= $invoice->total_amount) {
                        $invoice->update(['status' => 'paid']);
                    } else {
                        $invoice->update(['status' => 'partial']);
                    }
                }
            }

            $income->load(['client:id,name', 'invoice:id,invoice_number']);

            return response()->json([
                'success' => true,
                'data' => $income,
                'message' => 'Income recorded successfully',
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error recording income: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified income
     * GET /api/finance/incomes/{id}
     */
    public function show($id)
    {
        try {
            $income = Income::with(['client:id,name', 'invoice:id,invoice_number'])->find($id);

            if (!$income) {
                return response()->json([
                    'success' => false,
                    'message' => 'Income record not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $income,
                'message' => 'Income retrieved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving income: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified income
     * PUT /api/finance/incomes/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $income = Income::find($id);

            if (!$income) {
                return response()->json([
                    'success' => false,
                    'message' => 'Income record not found',
                ], 404);
            }

            $validated = $request->validate([
                'source' => 'string|max:255',
                'amount' => 'numeric|min:0.01',
                'payment_method' => 'in:bank_transfer,credit_card,cash,check,other',
                'received_at' => 'date|before_or_equal:today',
                'notes' => 'nullable|string',
                'status' => 'in:pending,completed,failed',
            ]);

            $income->update($validated);
            $income->load(['client:id,name', 'invoice:id,invoice_number']);

            return response()->json([
                'success' => true,
                'data' => $income,
                'message' => 'Income updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating income: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete the specified income
     * DELETE /api/finance/incomes/{id}
     */
    public function destroy($id)
    {
        try {
            $income = Income::find($id);

            if (!$income) {
                return response()->json([
                    'success' => false,
                    'message' => 'Income record not found',
                ], 404);
            }

            $income->delete();

            return response()->json([
                'success' => true,
                'message' => 'Income deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting income: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get income summary
     * GET /api/finance/incomes/summary
     */
    public function summary(Request $request)
    {
        try {
            $query = Income::where('status', 'completed');

            // Filter by date range
            if ($request->has('month') && $request->has('year')) {
                $query->whereYear('received_at', $request->year)
                    ->whereMonth('received_at', $request->month);
            } elseif ($request->has('date_from') && $request->has('date_to')) {
                $query->whereBetween('received_at', [
                    $request->date_from,
                    $request->date_to,
                ]);
            }

            $totalIncome = $query->sum('amount');
            $count = $query->count();
            $average = $count > 0 ? $totalIncome / $count : 0;

            // Group by source
            $bySource = Income::where('status', 'completed')
                ->when(
                    $request->has('month') && $request->has('year'),
                    fn($q) => $q->whereYear('received_at', $request->year)
                        ->whereMonth('received_at', $request->month)
                )
                ->when(
                    $request->has('date_from') && $request->has('date_to'),
                    fn($q) => $q->whereBetween('received_at', [
                        $request->date_from,
                        $request->date_to,
                    ])
                )
                ->groupBy('source')
                ->selectRaw('source, SUM(amount) as total, COUNT(*) as count')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_income' => $totalIncome,
                    'total_count' => $count,
                    'average_income' => $average,
                    'by_source' => $bySource,
                ],
                'message' => 'Summary retrieved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving summary: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get monthly income trends
     * GET /api/finance/incomes/trends/monthly
     */
    public function monthlyTrends(Request $request)
    {
        try {
            $months = $request->has('months') ? (int)$request->months : 12;

            $trends = [];
            for ($i = $months - 1; $i >= 0; $i--) {
                $date = Carbon::now()->subMonths($i);
                $income = Income::where('status', 'completed')
                    ->whereYear('received_at', $date->year)
                    ->whereMonth('received_at', $date->month)
                    ->sum('amount');

                $trends[] = [
                    'month' => $date->format('M Y'),
                    'date' => $date->format('Y-m'),
                    'income' => $income,
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $trends,
                'message' => 'Trends retrieved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving trends: ' . $e->getMessage(),
            ], 500);
        }
    }
}
