<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add foreign key constraint for lead.client_id
        Schema::table('leads', function (Blueprint $table) {
            if (!Schema::hasColumn('leads', 'client_id')) {
                $table->unsignedBigInteger('client_id')->nullable()->after('next_follow_up_at');
            }
            
            // Check if the foreign key constraint doesn't already exist
            try {
                $table->foreign('client_id')
                    ->references('id')
                    ->on('clients')
                    ->onDelete('set null');
            } catch (\Exception $e) {
                // Foreign key might already exist
            }
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            if (Schema::hasColumn('leads', 'client_id')) {
                try {
                    $table->dropForeign(['client_id']);
                } catch (\Exception $e) {
                    // Foreign key might not exist
                }
                $table->dropColumn('client_id');
            }
        });
    }
};
