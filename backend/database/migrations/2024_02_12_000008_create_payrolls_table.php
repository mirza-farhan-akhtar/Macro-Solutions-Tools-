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
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->decimal('salary_amount', 15, 2);
            $table->dateTime('paid_at');
            $table->enum('status', ['pending', 'processed', 'cancelled'])->default('pending');
            $table->timestamps();

            // Foreign keys
            $table->foreign('employee_id')->references('id')->on('users')->onDelete('cascade');

            // Indexing
            $table->index(['employee_id', 'paid_at']);
            $table->index('status');
            $table->index('paid_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
