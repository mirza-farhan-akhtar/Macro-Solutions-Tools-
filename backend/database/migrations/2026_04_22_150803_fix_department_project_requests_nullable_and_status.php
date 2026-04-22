<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('department_project_requests', function (Blueprint $table) {
            // target_user_id is optional — dept-to-dept requests have no specific target user
            $table->unsignedBigInteger('target_user_id')->nullable()->change();
        });

        // Expand status enum to include Cancelled and Withdrawn
        DB::statement("ALTER TABLE department_project_requests MODIFY status ENUM('Pending','Approved','Rejected','Cancelled','Withdrawn') NOT NULL DEFAULT 'Pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('department_project_requests', function (Blueprint $table) {
            $table->unsignedBigInteger('target_user_id')->nullable(false)->change();
        });

        DB::statement("ALTER TABLE department_project_requests MODIFY status ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending'");
    }
};
