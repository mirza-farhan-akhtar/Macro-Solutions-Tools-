<?php

namespace App\Http\Controllers\Finance;

use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ExpenseController extends Controller
{
    /**
     * Display a listing of expenses
     * GET /api/finance/expenses
     */
    public function index(Request $request)
    {
        try {
            $query = Expense::with('category')->orderBy('expense_date', 'desc');

            // Filters
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('date_from')) {
                $query->whereDate('expense_date', '>=', $request->date_from);
            }

            if ($request->has('date_to')) {
                $query->whereDate('expense_date', '<=', $request->date_to);
            }

            if ($request->has('vendor')) {
                $query->where('vendor', 'like', '%' . $request->vendor . '%');
            }

            if ($request->has('min_amount')) {
                $query->where('amount', '>=', $request->min_amount);
            }

            if ($request->has('max_amount')) {
                $query->where('amount', '<=', $request->max_amount);
            }

            $expenses = $query->paginate($request->per_page ?? 15);

            return response()->json([
                'success' => true,
                'data' => $expenses,
                'message' => 'Expenses retrieved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving expenses: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created expense
     * POST /api/finance/expenses
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'category_id' => 'required|exists:expense_categories,id',
                'vendor' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0.01',
                'payment_method' => 'required|in:bank_transfer,credit_card,cash,check',
                'expense_date' => 'required|date|before_or_equal:today',
                'receipt' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
                'notes' => 'nullable|string',
            ]);

            // Handle receipt upload
            $receiptPath = null;
            if ($request->hasFile('receipt')) {
                $receiptPath = $request->file('receipt')->store('expenses', 'public');
            }

            $expense = Expense::create([
                'category_id' => $validated['category_id'],
                'vendor' => $validated['vendor'],
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'expense_date' => $validated['expense_date'],
                'receipt_path' => $receiptPath,
                'notes' => $validated['notes'] ?? null,
                'status' => 'pending',
            ]);

            $expense->load('category');

            return response()->json([
                'success' => true,
                'data' => $expense,
                'message' => 'Expense created successfully',
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
                'message' => 'Error creating expense: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified expense
     * GET /api/finance/expenses/{id}
     */
    public function show($id)
    {
        try {
            $expense = Expense::with('category')->find($id);

            if (!$expense) {
                return response()->json([
                    'success' => false,
                    'message' => 'Expense not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $expense,
                'message' => 'Expense retrieved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving expense: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified expense
     * PUT /api/finance/expenses/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $expense = Expense::find($id);

            if (!$expense) {
                return response()->json([
                    'success' => false,
                    'message' => 'Expense not found',
                ], 404);
            }

            // Prevent editing approved/rejected expenses
            if (in_array($expense->status, ['approved', 'rejected'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot edit approved or rejected expenses',
                ], 422);
            }

            $validated = $request->validate([
                'category_id' => 'exists:expense_categories,id',
                'vendor' => 'string|max:255',
                'amount' => 'numeric|min:0.01',
                'payment_method' => 'in:bank_transfer,credit_card,cash,check',
                'expense_date' => 'date|before_or_equal:today',
                'notes' => 'nullable|string',
            ]);

            // Handle receipt upload
            if ($request->hasFile('receipt')) {
                // Delete old receipt if exists
                if ($expense->receipt_path) {
                    Storage::disk('public')->delete($expense->receipt_path);
                }
                $validated['receipt_path'] = $request->file('receipt')->store('expenses', 'public');
            }

            $expense->update($validated);
            $expense->load('category');

            return response()->json([
                'success' => true,
                'data' => $expense,
                'message' => 'Expense updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating expense: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete the specified expense
     * DELETE /api/finance/expenses/{id}
     */
    public function destroy($id)
    {
        try {
            $expense = Expense::find($id);

            if (!$expense) {
                return response()->json([
                    'success' => false,
                    'message' => 'Expense not found',
                ], 404);
            }

            // Prevent deleting approved expenses
            if ($expense->status === 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete approved expenses',
                ], 422);
            }

            // Delete receipt if exists
            if ($expense->receipt_path) {
                Storage::disk('public')->delete($expense->receipt_path);
            }

            $expense->delete();

            return response()->json([
                'success' => true,
                'message' => 'Expense deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting expense: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Approve an expense
     * PATCH /api/finance/expenses/{id}/approve
     */
    public function approve($id)
    {
        try {
            $expense = Expense::find($id);

            if (!$expense) {
                return response()->json([
                    'success' => false,
                    'message' => 'Expense not found',
                ], 404);
            }

            if ($expense->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending expenses can be approved',
                ], 422);
            }

            $expense->update(['status' => 'approved']);
            $expense->load('category');

            return response()->json([
                'success' => true,
                'data' => $expense,
                'message' => 'Expense approved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error approving expense: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reject an expense
     * PATCH /api/finance/expenses/{id}/reject
     */
    public function reject(Request $request, $id)
    {
        try {
            $expense = Expense::find($id);

            if (!$expense) {
                return response()->json([
                    'success' => false,
                    'message' => 'Expense not found',
                ], 404);
            }

            if ($expense->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending expenses can be rejected',
                ], 422);
            }

            $validated = $request->validate([
                'notes' => 'nullable|string',
            ]);

            $expense->update([
                'status' => 'rejected',
                'notes' => $validated['notes'] ?? $expense->notes,
            ]);
            $expense->load('category');

            return response()->json([
                'success' => true,
                'data' => $expense,
                'message' => 'Expense rejected successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error rejecting expense: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get expense categories
     * GET /api/finance/expense-categories
     */
    public function categories()
    {
        try {
            $categories = ExpenseCategory::orderBy('name')->get();

            return response()->json([
                'success' => true,
                'data' => $categories,
                'message' => 'Categories retrieved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving categories: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a new expense category
     * POST /api/finance/expense-categories
     */
    public function storeCategory(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|unique:expense_categories',
                'description' => 'nullable|string',
            ]);

            // Generate slug from name
            $slug = \Illuminate\Support\Str::slug($validated['name']);
            $validated['slug'] = $slug;

            $category = ExpenseCategory::create($validated);

            return response()->json([
                'success' => true,
                'data' => $category,
                'message' => 'Category created successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating category: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update an expense category
     * PUT /api/finance/expense-categories/{id}
     */
    public function updateCategory(Request $request, $id)
    {
        try {
            $category = ExpenseCategory::find($id);

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found',
                ], 404);
            }

            $validated = $request->validate([
                'name' => 'string|unique:expense_categories,name,' . $id,
                'description' => 'nullable|string',
            ]);

            // Generate slug from name if name is being updated
            if (isset($validated['name'])) {
                $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);
            }

            $category->update($validated);

            return response()->json([
                'success' => true,
                'data' => $category,
                'message' => 'Category updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating category: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an expense category
     * DELETE /api/finance/expense-categories/{id}
     */
    public function destroyCategory($id)
    {
        try {
            $category = ExpenseCategory::find($id);

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found',
                ], 404);
            }

            // Check if category has expenses
            if ($category->expenses()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete category with associated expenses',
                ], 422);
            }

            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting category: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get expense summary by category
     * GET /api/finance/expenses/summary/by-category
     */
    public function summaryByCategory(Request $request)
    {
        try {
            $query = Expense::where('status', 'approved');

            if ($request->has('month')) {
                $month = $request->month;
                $query->whereYear('expense_date', Carbon::now()->year)
                    ->whereMonth('expense_date', $month);
            }

            $summary = $query
                ->groupBy('category_id')
                ->selectRaw('category_id, SUM(amount) as total, COUNT(*) as count')
                ->with('category')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $summary,
                'message' => 'Summary retrieved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving summary: ' . $e->getMessage(),
            ], 500);
        }
    }
}
