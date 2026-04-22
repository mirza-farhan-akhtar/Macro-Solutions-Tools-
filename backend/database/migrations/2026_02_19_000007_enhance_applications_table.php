<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            if (!Schema::hasColumn('applications', 'application_status')) {
                $table->enum('application_status', ['Applied', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'])->default('Applied')->after('applicant_email');
            }
            if (!Schema::hasColumn('applications', 'internal_notes')) {
                $table->text('internal_notes')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('applications', 'assigned_to')) {
                $table->unsignedBigInteger('assigned_to')->nullable()->after('internal_notes');
            }
            if (!Schema::hasColumn('applications', 'interview_date')) {
                $table->dateTime('interview_date')->nullable()->after('assigned_to');
            }
        });
    }

    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn(['application_status', 'internal_notes', 'assigned_to', 'interview_date']);
        });
    }
};
