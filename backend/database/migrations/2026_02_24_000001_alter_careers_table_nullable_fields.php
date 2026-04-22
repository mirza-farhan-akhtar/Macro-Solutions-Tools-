<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('careers', function (Blueprint $table) {
            $table->string('location')->nullable()->default(null)->change();
            $table->string('type')->nullable()->default(null)->change();
            $table->string('status')->nullable()->default('active')->change();
        });
    }

    public function down(): void
    {
        Schema::table('careers', function (Blueprint $table) {
            $table->string('location')->nullable(false)->change();
            $table->string('type')->nullable(false)->change();
            $table->string('status')->nullable(false)->change();
        });
    }
};
