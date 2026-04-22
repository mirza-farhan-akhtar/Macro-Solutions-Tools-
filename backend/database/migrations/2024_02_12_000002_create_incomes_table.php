<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('incomes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id')->nullable();
            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->string('source');
            $table->decimal('amount', 15, 2);
            $table->string('payment_method')->default('bank_transfer');
            $table->string('transaction_reference')->unique();
            $table->date('received_at');
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->timestamps();
            $table->softDeletes();

            // Indexing
            $table->index(['client_id', 'status']);
            $table->index('received_at');
            $table->index('status');
        });

        // Add foreign keys after invoice table is created
        if (Schema::hasTable('applications') && Schema::hasTable('invoices')) {
            Schema::table('incomes', function (Blueprint $table) {
                $table->foreign('client_id')->references('id')->on('applications')->onDelete('set null');
                $table->foreign('invoice_id')->references('id')->on('invoices')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incomes');
    }
};
