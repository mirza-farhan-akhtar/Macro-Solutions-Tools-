<?php

namespace Database\Seeders;

use App\Models\ExpenseCategory;
use App\Models\Expense;
use App\Models\Income;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\TaxRate;
use App\Models\Application;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class FinanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Tax Rates
        $taxRates = [
            ['name' => 'Standard VAT', 'percentage' => 15.00],
            ['name' => 'Reduced VAT', 'percentage' => 8.00],
            ['name' => 'No Tax', 'percentage' => 0.00],
        ];

        foreach ($taxRates as $rate) {
            TaxRate::firstOrCreate(['name' => $rate['name']], $rate);
        }

        // Create Expense Categories
        $categories = [
            ['name' => 'Salaries', 'slug' => 'salaries', 'description' => 'Employee salaries and benefits'],
            ['name' => 'Software & Licenses', 'slug' => 'software-licenses', 'description' => 'Software subscriptions and licenses'],
            ['name' => 'Office Supplies', 'slug' => 'office-supplies', 'description' => 'Office and operational supplies'],
            ['name' => 'Marketing', 'slug' => 'marketing', 'description' => 'Marketing and advertising expenses'],
            ['name' => 'Utilities', 'slug' => 'utilities', 'description' => 'Electricity, water, internet'],
            ['name' => 'Travel', 'slug' => 'travel', 'description' => 'Travel and accommodation'],
            ['name' => 'Equipment', 'slug' => 'equipment', 'description' => 'Office equipment and machinery'],
            ['name' => 'Maintenance', 'slug' => 'maintenance', 'description' => 'Building and equipment maintenance'],
        ];

        foreach ($categories as $category) {
            ExpenseCategory::firstOrCreate(['slug' => $category['slug']], $category);
        }

        // Create Sample Invoices (without client links to avoid foreign key issues)
        for ($i = 1; $i <= 5; $i++) {
            $invoice = Invoice::create([
                'invoice_number' => 'INV-2026-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'client_id' => null, // No client link for now
                'issued_date' => Carbon::now()->subDays(rand(5, 30)),
                'due_date' => Carbon::now()->addDays(rand(5, 30)),
                'subtotal' => 1000 + ($i * 500),
                'tax_amount' => (1000 + ($i * 500)) * 0.15,
                'discount_amount' => $i * 50,
                'total_amount' => (1000 + ($i * 500)) * 1.15 - ($i * 50),
                'status' => $i <= 2 ? 'paid' : ($i <= 4 ? 'partial' : 'draft'),
            ]);

            // Add invoice items
            for ($j = 1; $j <= 3; $j++) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'description' => "Service Item $j for Invoice $i",
                    'quantity' => $j,
                    'unit_price' => 250 + ($j * 100),
                    'total' => $j * (250 + ($j * 100)),
                ]);
            }

            // Add payments for paid/partial invoices
            if ($i <= 2) {
                Payment::create([
                    'invoice_id' => $invoice->id,
                    'amount' => $invoice->total_amount,
                    'payment_method' => 'bank_transfer',
                    'transaction_reference' => 'TXN-2026-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                    'paid_at' => Carbon::now()->subDays(rand(1, 10)),
                ]);
            } elseif ($i <= 4) {
                Payment::create([
                    'invoice_id' => $invoice->id,
                    'amount' => $invoice->total_amount * 0.5,
                    'payment_method' => 'credit_card',
                    'transaction_reference' => 'TXN-2026-P' . str_pad($i, 4, '0', STR_PAD_LEFT),
                    'paid_at' => Carbon::now()->subDays(rand(1, 10)),
                ]);
            }
        }

        // Create Sample Expenses
        $expenseCategories = ExpenseCategory::all();
        for ($i = 1; $i <= 15; $i++) {
            Expense::create([
                'category_id' => $expenseCategories->random()->id,
                'vendor' => 'Vendor ' . rand(1, 10),
                'amount' => 100 + ($i * 50),
                'payment_method' => ['bank_transfer', 'credit_card', 'cash', 'check'][rand(0, 3)],
                'expense_date' => Carbon::now()->subDays(rand(1, 60)),
                'notes' => "Sample expense for testing $i",
                'status' => $i <= 10 ? 'approved' : ($i <= 13 ? 'pending' : 'rejected'),
            ]);
        }

        // Create Sample Income Records
        for ($i = 1; $i <= 10; $i++) {
            Income::create([
                'client_id' => null, // No client link
                'invoice_id' => Invoice::inRandomOrder()->first()->id,
                'source' => ['Service Income', 'Consulting', 'Licensing', 'Support'][rand(0, 3)],
                'amount' => 500 + ($i * 200),
                'payment_method' => ['bank_transfer', 'credit_card', 'check'][rand(0, 2)],
                'transaction_reference' => 'INC-2026-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'received_at' => Carbon::now()->subDays(rand(1, 45)),
                'notes' => "Sample income record $i",
                'status' => 'completed',
            ]);
        }

        $this->command->info('Finance module seeded successfully!');
        $this->command->info('- 5 invoices with items and some payments');
        $this->command->info('- 15 expenses across 8 categories');
        $this->command->info('- 10 income records from various sources');
        $this->command->info('- 3 tax rates');
    }
}
