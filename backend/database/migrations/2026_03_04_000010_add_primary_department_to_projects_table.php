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
        Schema::table('projects', function (Blueprint $table) {
            // Add primary department field to mark project ownership
            $table->foreignId('primary_department_id')
                  ->nullable()
                  ->constrained('departments')
                  ->onDelete('set null')
                  ->after('created_by');
            
            // Add index for faster queries
            $table->index(['primary_department_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeignKeyIfExists(['primary_department_id']);
            $table->dropIndex(['primary_department_id']);
            $table->dropColumn('primary_department_id');
        });
    }
};
