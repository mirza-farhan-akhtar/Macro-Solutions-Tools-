<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->json('features')->nullable()->after('content');
            $table->json('benefits')->nullable()->after('features');
            $table->json('process_steps')->nullable()->after('benefits');
            $table->json('technologies')->nullable()->after('process_steps');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['features', 'benefits', 'process_steps', 'technologies']);
        });
    }
};