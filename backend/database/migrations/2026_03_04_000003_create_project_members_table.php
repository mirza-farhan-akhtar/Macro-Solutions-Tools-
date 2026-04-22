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
        Schema::create('project_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('role_in_project', [
                'Project Manager',
                'Team Lead',
                'Developer',
                'Designer',
                'Analyst',
                'QA Engineer',
                'DevOps Engineer',
                'Consultant',
                'Other'
            ])->default('Developer');
            $table->boolean('is_lead')->default(false);
            $table->date('joined_at')->nullable();
            $table->date('left_at')->nullable();
            $table->text('responsibilities')->nullable();
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->timestamps();
            
            $table->unique(['project_id', 'user_id']);
            $table->index(['project_id']);
            $table->index(['user_id']);
            $table->index(['role_in_project']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_members');
    }
};