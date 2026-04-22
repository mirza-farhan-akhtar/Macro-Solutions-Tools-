<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

use App\Models\Department;
use App\Models\User;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "\n=== CREATING COMPREHENSIVE TEST DATA ===\n\n";

// Create multiple departments with heads
$departments = [
    ['name' => 'Human Resources', 'code' => 'HR', 'description' => 'HR & Personnel Management'],
    ['name' => 'Information Technology', 'code' => 'IT', 'description' => 'IT & Infrastructure'],
    ['name' => 'Sales & Marketing', 'code' => 'SALES', 'description' => 'Sales and Market Development'],
    ['name' => 'Finance & Accounting', 'code' => 'FIN', 'description' => 'Financial Management'],
    ['name' => 'Operations', 'code' => 'OPS', 'description' => 'Daily Operations Management'],
];

$users = User::where('role', '!=', 'admin')->take(5)->get();
if ($users->count() < 5) {
    $users = User::take(5)->get();
}

$createdDepts = [];
echo "Creating departments:\n";
foreach ($departments as $i => $dept) {
    $deptModel = Department::firstOrCreate(
        ['code' => $dept['code']],
        array_merge($dept, [
            'status' => 'Active',
            'head_id' => $users[$i]->id ?? null,
        ])
    );
    $createdDepts[] = $deptModel;
    echo "  ✓ {$deptModel->name} (Head: " . ($users[$i]->name ?? 'Unassigned') . ")\n";
}

// Create sub-departments (IT teams)
echo "\nCreating sub-departments:\n";
$itDept = $createdDepts[1];
$subDepts = [
    ['name' => 'Backend Development', 'code' => 'BE_DEV', 'description' => 'Backend Engineering Team'],
    ['name' => 'Frontend Development', 'code' => 'FE_DEV', 'description' => 'Frontend Engineering Team'],
    ['name' => 'DevOps & Infrastructure', 'code' => 'DEVOPS', 'description' => 'DevOps and Cloud Infrastructure'],
];

foreach ($subDepts as $sub) {
    $subDept = Department::firstOrCreate(
        ['code' => $sub['code']],
        array_merge($sub, [
            'parent_id' => $itDept->id,
            'status' => 'Active',
        ])
    );
    echo "  ✓ {$subDept->name} (Parent: {$itDept->name})\n";
}

// Assign users to departments
echo "\nAssigning employees to departments:\n";
$assignedCount = 0;
$allUsers = User::where('role', '!=', 'admin')->get();

foreach ($createdDepts as $dept) {
    $toAssign = $allUsers
        ->where('department_id', null)
        ->take(2)
        ->values();
    
    foreach ($toAssign as $user) {
        $user->update([
            'department_id' => $dept->id,
            'designation' => 'Team Member',
            'employment_type' => 'Full-time',
        ]);
        $assignedCount++;
        $allUsers = $allUsers->where('id', '!=', $user->id);
    }
}

echo "  ✓ Assigned $assignedCount users to departments\n";

// Final summary
echo "\n=== TEST DATA SUMMARY ===\n";
$stats = [
    'Total Departments' => Department::count(),
    'Active Departments' => Department::active()->count(),
    'Root-level Departments' => Department::root()->count(),
    'Sub-departments' => Department::whereNotNull('parent_id')->count(),
    'Users in Departments' => User::whereNotNull('department_id')->count(),
    'Department Heads Assigned' => User::whereHas('headsOfDepartments')->count(),
];

foreach ($stats as $label => $value) {
    echo "  $label: $value\n";
}

echo "\n✅ TEST DATA CREATED SUCCESSFULLY\n";
echo "=== READY FOR FRONTEND INTEGRATION TESTING ===\n\n";
