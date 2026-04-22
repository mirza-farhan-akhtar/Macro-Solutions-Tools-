<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('application_id');
            $table->unsignedBigInteger('interviewer_id')->nullable();
            $table->dateTime('scheduled_date');
            $table->string('interview_type'); // Phone, Video, In-Person
            $table->text('description')->nullable();
            $table->text('interview_notes')->nullable();
            $table->enum('status', ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'])->default('Scheduled');
            $table->decimal('rating', 3, 1)->nullable(); // 1-5 scale
            $table->enum('outcome', ['Pass', 'Fail', 'Pending', 'On Hold'])->default('Pending');
            $table->timestamps();
            
            $table->foreign('application_id')->references('id')->on('applications')->onDelete('cascade');
            $table->foreign('interviewer_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
