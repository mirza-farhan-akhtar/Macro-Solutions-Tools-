<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('careers', function (Blueprint $table) {
            if (!Schema::hasColumn('careers', 'department')) {
                $table->string('department')->nullable()->after('description');
            }
            if (!Schema::hasColumn('careers', 'employment_type')) {
                $table->enum('employment_type', ['Full-time', 'Part-time', 'Contract', 'Temporary'])->default('Full-time')->after('department');
            }
            if (!Schema::hasColumn('careers', 'salary_min')) {
                $table->decimal('salary_min', 12, 2)->nullable()->after('employment_type');
            }
            if (!Schema::hasColumn('careers', 'salary_max')) {
                $table->decimal('salary_max', 12, 2)->nullable()->after('salary_min');
            }
            if (!Schema::hasColumn('careers', 'hiring_status')) {
                $table->enum('hiring_status', ['Open', 'Closed', 'On Hold'])->default('Open')->after('salary_max');
            }
        });
    }

    public function down(): void
    {
        Schema::table('careers', function (Blueprint $table) {
            $table->dropColumn(['department', 'employment_type', 'salary_min', 'salary_max', 'hiring_status']);
        });
    }
};
