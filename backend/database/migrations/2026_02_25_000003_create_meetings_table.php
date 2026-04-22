<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('meeting_date');
            $table->time('meeting_time');
            $table->integer('duration')->default(60); // minutes
            $table->string('location')->nullable();
            $table->string('meeting_link')->nullable();
            $table->unsignedBigInteger('organizer_id'); // user_id
            $table->enum('status', ['Scheduled', 'In Progress', 'Completed', 'Cancelled'])->default('Scheduled');
            $table->json('attendee_user_ids')->nullable(); // array of user IDs
            $table->json('attendee_employee_ids')->nullable(); // array of employee IDs
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
