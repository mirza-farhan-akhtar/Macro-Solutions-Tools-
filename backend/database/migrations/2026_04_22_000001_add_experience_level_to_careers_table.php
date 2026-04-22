<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('careers', function (Blueprint $table) {
            if (!Schema::hasColumn('careers', 'experience_level')) {
                $table->string('experience_level')->nullable()->after('salary_range');
            }
        });
    }

    public function down(): void
    {
        Schema::table('careers', function (Blueprint $table) {
            if (Schema::hasColumn('careers', 'experience_level')) {
                $table->dropColumn('experience_level');
            }
        });
    }
};
