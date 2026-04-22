<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique(); // e.g., EMP-001
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('department');
            $table->string('designation');
            $table->date('joining_date');
            $table->enum('employment_type', ['Full-time', 'Part-time', 'Contract', 'Temporary']);
            $table->decimal('salary', 12, 2)->nullable();
            $table->enum('status', ['Active', 'Resigned', 'Terminated', 'On Leave'])->default('Active');
            $table->string('emergency_contact')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->text('address')->nullable();
            $table->string('emergency_contact_relation')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('pan_number')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
