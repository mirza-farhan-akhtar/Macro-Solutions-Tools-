<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add missing columns to departments table
        if (!Schema::hasColumn('departments', 'head_id')) {
            Schema::table('departments', function (Blueprint $table) {
                $table->unsignedBigInteger('head_id')->nullable();
            });
        }

        if (!Schema::hasColumn('departments', 'parent_id')) {
            Schema::table('departments', function (Blueprint $table) {
                $table->unsignedBigInteger('parent_id')->nullable();
            });
        }

        if (!Schema::hasColumn('departments', 'deleted_at')) {
            Schema::table('departments', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            if (Schema::hasColumn('departments', 'head_id')) {
                $table->dropColumn('head_id');
            }
            if (Schema::hasColumn('departments', 'parent_id')) {
                $table->dropColumn('parent_id');
            }
            if (Schema::hasColumn('departments', 'deleted_at')) {
                $table->dropColumn('deleted_at');
            }
        });
    }
};
