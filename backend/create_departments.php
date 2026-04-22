<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Department;
use App\Models\User;

echo "=== Creating Dummy Departments ===\n\n";

// Clear existing departments
Department::query()->delete();

// Get some users to assign as heads
$users = User::limit(5)->get();

$departments = [
    [
        'name' => 'Human Resources',
        'code' => 'HR',
        'description' => 'Manages recruitment, employee relations, and personnel matters',
        'status' => 'active',
        'head_id' => $users[0]->id ?? null,
    ],
    [
        'name' => 'Engineering',
        'code' => 'ENG',
        'description' => 'Develops and maintains software solutions and infrastructure',
        'status' => 'active',
        'head_id' => $users[1]->id ?? null,
    ],
    [
        'name' => 'Finance',
        'code' => 'FIN',
        'description' => 'Handles accounting, budgeting, and financial management',
        'status' => 'active',
        'head_id' => $users[2]->id ?? null,
    ],
    [
        'name' => 'Sales & Marketing',
        'code' => 'SAL',
        'description' => 'Drives business development and customer acquisition',
        'status' => 'active',
        'head_id' => $users[3]->id ?? null,
    ],
    [
        'name' => 'Operations',
        'code' => 'OPS',
        'description' => 'Manages day-to-day operations and processes',
        'status' => 'active',
        'head_id' => $users[4]->id ?? null,
    ],
];

foreach ($departments as $dept) {
    Department::create($dept);
    echo "✓ Created: {$dept['name']} ({$dept['code']})\n";
}

echo "\n✅ Dummy departments created successfully!\n";
echo "Total: " . Department::count() . " departments\n";
