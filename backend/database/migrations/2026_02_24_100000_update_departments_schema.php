<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Check if departments table has the full schema, if not add missing columns
        Schema::table('departments', function (Blueprint $table) {
            // Add columns if they don't exist
            if (!Schema::hasColumn('departments', 'head_id')) {
                $table->unsignedBigInteger('head_id')->nullable()->after('description');
            }
            if (!Schema::hasColumn('departments', 'parent_id')) {
                $table->unsignedBigInteger('parent_id')->nullable()->after('head_id');
            }
        });

        // Remove the old columns that were added to users table temporarily
        // and ensure they're properly set up
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'department_id')) {
                $table->unsignedBigInteger('department_id')->nullable();
            }
            if (!Schema::hasColumn('users', 'designation')) {
                $table->string('designation')->nullable();
            }
            if (!Schema::hasColumn('users', 'employment_type')) {
                $table->string('employment_type')->nullable();
            }
        });

        // Add soft deletes to departments if not already present
        if (!Schema::hasColumn('departments', 'deleted_at')) {
            Schema::table('departments', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            // Drop columns if they exist
            if (Schema::hasColumn('departments', 'head_id')) {
                $table->dropForeign(['head_id']);
                $table->dropColumn('head_id');
            }
            if (Schema::hasColumn('departments', 'parent_id')) {
                $table->dropForeign(['parent_id']);
                $table->dropColumn('parent_id');
            }
            if (Schema::hasColumn('departments', 'deleted_at')) {
                $table->dropColumn('deleted_at');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'department_id')) {
                $table->dropForeign(['department_id']);
                $table->dropColumn('department_id');
            }
            if (Schema::hasColumn('users', 'designation')) {
                $table->dropColumn('designation');
            }
            if (Schema::hasColumn('users', 'employment_type')) {
                $table->dropColumn('employment_type');
            }
        });
    }
};

