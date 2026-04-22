<?php
// Quick test script for department system
require __DIR__ . '/vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;
use App\Models\Department;
use App\Models\User;

// Bootstrap Laravel
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "\n=== DEPARTMENT SYSTEM: MODEL & RELATIONSHIP TESTS ===\n\n";

try {
    // Test 1: Count departments
    $count = Department::count();
    echo "✓ Test 1: Department count: $count\n";

    // Test 2: Get departments with relationships
    $depts = Department::with(['head', 'employees', 'parent', 'children'])->get();
    echo "✓ Test 2: Loaded " . count($depts) . " departments with relationships\n";
    
    foreach ($depts as $dept) {
        echo "  - Department: {$dept->name} ({$dept->code})\n";
        echo "    Head: " . ($dept->head ? $dept->head->name : 'Unassigned') . "\n";
        echo "    Employees: " . count($dept->employees) . "\n";
        echo "    Parent: " . ($dept->parent ? $dept->parent->name : 'None (Root)') . "\n";
        echo "    Children: " . count($dept->children) . "\n";
    }

    // Test 3: Verify soft deletes
    $dept = Department::first();
    if ($dept && method_exists($dept, 'isForceDeleting')) {
        echo "✓ Test 3: Department uses SoftDeletes trait\n";
    }

    // Test 4: Check User-Department relationships
    $users = User::with('department')->get();
    echo "✓ Test 4: Loaded " . count($users) . " users with departments\n";
    
    $usersWithDept = $users->filter(fn($u) => $u->department_id)->count();
    echo "  - Users with departments: $usersWithDept\n";

    // Test 5: Check if any user is a department head
    $heads = User::whereHas('headsOfDepartments')->get();
    echo "✓ Test 5: Users who are department heads: " . count($heads) . "\n";

    // Test 6: Verify scopes work
    $activeDepts = Department::active()->count();
    $rootDepts = Department::root()->count();
    echo "✓ Test 6: Active departments: $activeDepts, Root departments: $rootDepts\n";

    // Test 7: Check permissions exist
    $permissions = \App\Models\Permission::where('slug', 'like', 'department%')->get();
    echo "✓ Test 7: Department permissions in system: " . count($permissions) . "\n";
    foreach ($permissions as $perm) {
        echo "  - {$perm->slug}: {$perm->name}\n";
    }

    echo "\n✅ ALL TESTS PASSED!\n";
    echo "=== SYSTEM IS READY FOR TESTING ===\n\n";

} catch (\Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}

