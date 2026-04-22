<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            // Add new CRM fields if they don't exist
            if (!Schema::hasColumn('leads', 'company_name')) {
                $table->string('company_name')->nullable()->after('company');
            }
            if (!Schema::hasColumn('leads', 'industry')) {
                $table->string('industry')->nullable()->after('company_name');
            }
            if (!Schema::hasColumn('leads', 'budget_range')) {
                $table->string('budget_range')->nullable()->after('industry');
            }
            if (!Schema::hasColumn('leads', 'priority')) {
                $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium')->after('budget_range');
            }
            if (!Schema::hasColumn('leads', 'tags')) {
                $table->json('tags')->nullable()->after('priority');
            }
            if (!Schema::hasColumn('leads', 'lead_status')) {
                $table->enum('lead_status', ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost'])->default('new')->after('status');
            }
            if (!Schema::hasColumn('leads', 'notes')) {
                $table->longText('notes')->nullable()->after('lead_status');
            }
            if (!Schema::hasColumn('leads', 'last_contact_at')) {
                $table->timestamp('last_contact_at')->nullable()->after('notes');
            }
            if (!Schema::hasColumn('leads', 'next_follow_up_at')) {
                $table->timestamp('next_follow_up_at')->nullable()->after('last_contact_at');
            }
            if (!Schema::hasColumn('leads', 'client_id')) {
                $table->unsignedBigInteger('client_id')->nullable()->after('next_follow_up_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn([
                'company_name',
                'industry',
                'budget_range',
                'priority',
                'tags',
                'lead_status',
                'notes',
                'last_contact_at',
                'next_follow_up_at',
            ]);
        });
    }
};
