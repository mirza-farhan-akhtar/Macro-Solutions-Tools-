<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Department;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            if (!Schema::hasColumn('departments', 'slug')) {
                $table->string('slug')->unique()->nullable()->after('name');
            }
        });

        // Populate slug for existing departments
        try {
            $departments = Department::all();
            foreach ($departments as $dept) {
                if (!$dept->slug) {
                    $dept->slug = Str::slug($dept->name);
                    $dept->save();
                }
            }
        } catch (\Exception $e) {
            // Silent fail if departments table doesn't exist yet
        }
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            if (Schema::hasColumn('departments', 'slug')) {
                $table->dropColumn('slug');
            }
        });
    }
};
