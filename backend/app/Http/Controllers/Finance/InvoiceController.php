<?php

namespace App\Http\Controllers\Finance;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\TaxRate;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InvoiceController extends Controller
{
    /**
     * Display a listing of invoices
     * GET /api/finance/invoices
     */
    public function index(Request $request)
    {
        try {
            $query = Invoice::with(['client:id,company_name', 'items', 'payments'])
                ->orderBy('created_at', 'desc');

            // Filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('client_id')) {
                $query->where('client_id', $request->client_id);
            }

            if ($request->has('date_from')) {
                $query->whereDate('issued_date', '>=', $request->date_from);
            }

            if ($request->has('date_to')) {
                $query->whereDate('issued_date', '<=', $request->date_to);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            }

            $invoices = $query->paginate($request->per_page ?? 15);

            // Ensure all invoices have total_amount calculated
            $invoices->getCollection()->transform(function ($invoice) {
                if (!$invoice->total_amount || $invoice->total_amount == 0) {
                    $itemsTotal = $invoice->items->sum('amount');
                    $invoice->total_amount = $itemsTotal + ($invoice->tax_amount ?? 0) - ($invoice->discount_amount ?? 0);
                }
                return $invoice;
            });

            return response()->json([
                'success' => true,
                'data' => $invoices,
                'message' => 'Invoices retrieved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving invoices: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created invoice
     * POST /api/finance/invoices
     */
    public function store(Request $request)
    {
        try {
            // Validate request
            $validated = $request->validate([
                'invoice_number' => 'required|string|unique:invoices',
                'client_id' => 'nullable|exists:applications,id',
                'issued_date' => 'required|date|before_or_equal:today',
                'due_date' => 'required|date|after_or_equal:issued_date',
                'items' => 'required|array|min:1',
                'items.*.description' => 'required|string',
                'items.*.quantity' => 'required|numeric|min:0.01',
                'items.*.unit_price' => 'required|numeric|min:0',
                'tax_rate_id' => 'nullable|exists:tax_rates,id',
                'discount_amount' => 'nullable|numeric|min:0',
                'notes' => 'nullable|string',
            ]);

            // Use transaction to ensure atomicity
            $invoice = DB::transaction(function () use ($validated) {
                // Create invoice
                $subtotal = 0;

                // Calculate subtotal from items
                foreach ($validated['items'] as $item) {
                    $subtotal += $item['quantity'] * $item['unit_price'];
                }

                // Get tax amount if tax_rate provided
                $taxAmount = 0;
                if ($validated['tax_rate_id'] ?? null) {
                    $taxRate = TaxRate::find($validated['tax_rate_id']);
                    if ($taxRate) {
                        $taxAmount = ($subtotal * $taxRate->percentage) / 100;
                    }
                }

                // Get discount amount
                $discountAmount = $validated['discount_amount'] ?? 0;

                // Calculate total
                $totalAmount = $subtotal + $taxAmount - $discountAmount;

                // Create invoice record
                $invoice = Invoice::create([
                    'invoice_number' => $validated['invoice_number'],
                    'client_id' => $validated['client_id'] ?? null,
                    'issued_date' => $validated['issued_date'],
                    'due_date' => $validated['due_date'],
                    'subtotal' => $subtotal,
                    'tax_amount' => $taxAmount,
                    'discount_amount' => $discountAmount,
                    'total_amount' => $totalAmount,
                    'status' => 'draft',
                    'notes' => $validated['notes'] ?? null,
                ]);

                // Add line items
                foreach ($validated['items'] as $item) {
                    $total = $item['quantity'] * $item['unit_price'];
                    InvoiceItem::create([
                        'invoice_id' => $invoice->id,
                        'description' => $item['description'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total' => $total,
                    ]);
                }

                return $invoice;
            });

            // Load relationships for response
            $invoice->load(['client:id,company_name', 'items', 'payments']);

            return response()->json([
                'success' => true,
                'data' => $invoice,
                'message' => 'Invoice created successfully',
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
                'message' => 'Error creating invoice: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified invoice
     * GET /api/finance/invoices/{id}
     */
    public function show($id)
    {
        try {
            $invoice = Invoice::with(['client:id,company_name', 'items', 'payments'])->find($id);

            if (!$invoice) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $invoice,
                'message' => 'Invoice retrieved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving invoice: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified invoice
     * PUT /api/finance/invoices/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $invoice = Invoice::find($id);

            if (!$invoice) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice not found',
                ], 404);
            }

            // Prevent editing paid/overdue invoices
            if (in_array($invoice->status, ['paid', 'overdue'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot edit paid or overdue invoices',
                ], 422);
            }

            $validated = $request->validate([
                'invoice_number' => 'string|unique:invoices,invoice_number,' . $id,
                'client_id' => 'nullable|exists:applications,id',
                'due_date' => 'nullable|date|after_or_equal:today',
                'discount_amount' => 'nullable|numeric|min:0',
                'notes' => 'nullable|string',
            ]);

            $invoice->update($validated);
            $invoice->load(['client:id,company_name', 'items', 'payments']);

            return response()->json([
                'success' => true,
                'data' => $invoice,
                'message' => 'Invoice updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating invoice: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete the specified invoice
     * DELETE /api/finance/invoices/{id}
     */
    public function destroy($id)
    {
        try {
            $invoice = Invoice::find($id);

            if (!$invoice) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice not found',
                ], 404);
            }

            $invoice->delete();

            return response()->json([
                'success' => true,
                'message' => 'Invoice deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting invoice: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add items to an existing invoice
     * POST /api/finance/invoices/{id}/items
     */
    public function addItems(Request $request, $id)
    {
        try {
            $invoice = Invoice::find($id);

            if (!$invoice) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice not found',
                ], 404);
            }

            if ($invoice->status !== 'draft') {
                return response()->json([
                    'success' => false,
                    'message' => 'Can only add items to draft invoices',
                ], 422);
            }

            $validated = $request->validate([
                'items' => 'required|array|min:1',
                'items.*.description' => 'required|string',
                'items.*.quantity' => 'required|numeric|min:0.01',
                'items.*.unit_price' => 'required|numeric|min:0',
            ]);

            DB::transaction(function () use ($invoice, $validated) {
                $additionalSubtotal = 0;

                foreach ($validated['items'] as $item) {
                    $total = $item['quantity'] * $item['unit_price'];
                    InvoiceItem::create([
                        'invoice_id' => $invoice->id,
                        'description' => $item['description'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total' => $total,
                    ]);
                    $additionalSubtotal += $total;
                }

                // Recalculate invoice totals
                $newSubtotal = $invoice->subtotal + $additionalSubtotal;
                $taxPercentage = ($invoice->tax_amount > 0)
                    ? ($invoice->tax_amount / $invoice->subtotal) * 100
                    : 0;
                $newTaxAmount = ($newSubtotal * $taxPercentage) / 100;
                $newTotalAmount = $newSubtotal + $newTaxAmount - $invoice->discount_amount;

                $invoice->update([
                    'subtotal' => $newSubtotal,
                    'tax_amount' => $newTaxAmount,
                    'total_amount' => $newTotalAmount,
                ]);
            });

            $invoice->load('items');

            return response()->json([
                'success' => true,
                'data' => $invoice,
                'message' => 'Items added successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error adding items: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update invoice status
     * PATCH /api/finance/invoices/{id}/status
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $invoice = Invoice::find($id);

            if (!$invoice) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice not found',
                ], 404);
            }

            $validated = $request->validate([
                'status' => 'required|string|in:draft,sent,paid,partial,overdue,cancelled',
            ]);

            $invoice->update(['status' => $validated['status']]);
            $invoice->load(['client:id,company_name', 'items', 'payments']);

            return response()->json([
                'success' => true,
                'data' => $invoice,
                'message' => 'Invoice status updated to ' . $validated['status'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating status: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send the invoice (mark as sent)
     * POST /api/finance/invoices/{id}/send
     */
    public function send($id)
    {
        try {
            $invoice = Invoice::find($id);

            if (!$invoice) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice not found',
                ], 404);
            }

            if ($invoice->status !== 'draft') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only draft invoices can be sent',
                ], 422);
            }

            $invoice->update(['status' => 'sent']);
            $invoice->load(['client:id,company_name', 'items', 'payments']);

            return response()->json([
                'success' => true,
                'data' => $invoice,
                'message' => 'Invoice sent successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending invoice: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Record a payment for the invoice
     * POST /api/finance/invoices/{id}/pay
     */
    public function recordPayment(Request $request, $id)
    {
        try {
            $invoice = Invoice::with('payments')->find($id);

            if (!$invoice) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice not found',
                ], 404);
            }

            $validated = $request->validate([
                'amount' => 'required|numeric|min:0.01',
                'payment_method' => 'required|in:bank_transfer,credit_card,cash,check',
                'transaction_reference' => 'required|string|unique:payments',
                'paid_at' => 'required|date|before_or_equal:now',
                'notes' => 'nullable|string',
            ]);

            // Check if payment would exceed outstanding amount
            $totalPaid = $invoice->payments->sum('amount');
            $outstanding = $invoice->total_amount - $totalPaid;

            if ($validated['amount'] > $outstanding) {
                return response()->json([
                    'success' => false,
                    'message' => "Payment amount cannot exceed outstanding balance of {$outstanding}",
                ], 422);
            }

            DB::transaction(function () use ($invoice, $validated, $totalPaid) {
                // Record payment
                Payment::create([
                    'invoice_id' => $invoice->id,
                    'amount' => $validated['amount'],
                    'payment_method' => $validated['payment_method'],
                    'transaction_reference' => $validated['transaction_reference'],
                    'paid_at' => $validated['paid_at'],
                    'notes' => $validated['notes'] ?? null,
                ]);

                // Update invoice status based on payment
                $newTotal = $totalPaid + $validated['amount'];

                if ($newTotal >= $invoice->total_amount) {
                    $invoice->update(['status' => 'paid']);
                } else {
                    $invoice->update(['status' => 'partial']);
                }
            });

            $invoice->load(['client:id,company_name', 'items', 'payments']);

            return response()->json([
                'success' => true,
                'data' => $invoice,
                'message' => 'Payment recorded successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error recording payment: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mark overdue invoices (scheduled task)
     * This should be called by a scheduled job
     */
    public function markOverdue()
    {
        try {
            $overdue = Invoice::where('due_date', '<', Carbon::today())
                ->where('status', '!=', 'paid')
                ->update(['status' => 'overdue']);

            return response()->json([
                'success' => true,
                'message' => "{$overdue} invoices marked as overdue",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error marking overdue invoices: ' . $e->getMessage(),
            ], 500);
        }
    }
}
