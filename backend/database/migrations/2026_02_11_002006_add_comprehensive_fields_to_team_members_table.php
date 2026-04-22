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
        Schema::table('team_members', function (Blueprint $table) {
            $table->string('department')->nullable()->after('position');
            $table->date('joining_date')->nullable()->after('department');
            $table->date('birthday')->nullable()->after('joining_date');
            $table->string('phone')->nullable()->after('email');
            $table->decimal('salary', 10, 2)->nullable()->after('phone');
            $table->string('employee_id')->nullable()->after('salary');
            $table->enum('employment_type', ['full-time', 'part-time', 'contract', 'intern'])->default('full-time')->after('employee_id');
            $table->string('experience_level')->nullable()->after('employment_type');
            $table->json('skills')->nullable()->after('experience_level');
            $table->string('education')->nullable()->after('skills');
            $table->text('achievements')->nullable()->after('education');
            $table->string('emergency_contact_name')->nullable()->after('achievements');
            $table->string('emergency_contact_phone')->nullable()->after('emergency_contact_name');
            $table->text('address')->nullable()->after('emergency_contact_phone');
            $table->string('instagram')->nullable()->after('twitter');
            $table->string('github')->nullable()->after('instagram');
            $table->string('portfolio_url')->nullable()->after('github');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('team_members', function (Blueprint $table) {
            $table->dropColumn([
                'department',
                'joining_date',
                'birthday',
                'phone',
                'salary',
                'employee_id',
                'employment_type',
                'experience_level',
                'skills',
                'education',
                'achievements',
                'emergency_contact_name',
                'emergency_contact_phone',
                'address',
                'instagram',
                'github',
                'portfolio_url'
            ]);
        });
    }
};
