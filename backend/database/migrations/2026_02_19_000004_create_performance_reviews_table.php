<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('performance_reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->string('review_period'); // e.g., 2026-Q1
            $table->decimal('rating', 3, 1); // 1-5 scale
            $table->unsignedBigInteger('reviewer_id');
            $table->text('comments');
            $table->text('improvement_notes')->nullable();
            $table->text('strengths')->nullable();
            $table->text('areas_for_improvement')->nullable();
            $table->enum('status', ['Draft', 'Submitted', 'Reviewed', 'Acknowledged'])->default('Draft');
            $table->timestamps();
            
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('reviewer_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('performance_reviews');
    }
};
