<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deals', function (Blueprint $table) {
            $table->id();
            $table->string('deal_name');
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('lead_id')->nullable()->constrained('leads')->onDelete('set null');
            $table->decimal('value', 15, 2);
            $table->enum('stage', ['qualification', 'proposal', 'negotiation', 'won', 'lost'])->default('qualification');
            $table->integer('probability')->default(0); // 0-100%
            $table->date('expected_closing_date')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->longText('notes')->nullable();
            $table->date('won_date')->nullable();
            $table->string('lost_reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deals');
    }
};
