<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check what permissions exist
$all = \App\Models\Permission::all();
echo "All permissions in system: " . count($all) . "\n\n";

// Check for department permissions
$dept = \App\Models\Permission::where('slug', 'like', 'department%')->get();
echo "Department permissions: " . count($dept) . "\n";
foreach ($dept as $p) {
    echo "  - {$p->slug}: {$p->name}\n";
}

// Try to seed them again
echo "\nSeeding department permissions...\n";
$seeder = new Database\Seeders\DepartmentPermissionSeeder();
$seeder->run();

// Check again
$dept = \App\Models\Permission::where('slug', 'like', 'department%')->get();
echo "\nAfter seeding: " . count($dept) . " department permissions\n";
foreach ($dept as $p) {
    echo "  ✓ {$p->slug}: {$p->name}\n";
}
