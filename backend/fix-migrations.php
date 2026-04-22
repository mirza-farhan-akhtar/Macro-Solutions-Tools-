<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Mark the problematic migration as completed
\DB::table('migrations')->where('migration', '2026_02_24_000000_create_departments_table')->delete();
\DB::table('migrations')->insert([
    'migration' => '2026_02_24_000000_create_departments_table',
    'batch' => 3,
]);

echo "✓ Migration marked as complete\n";

// Now test if table has the required columns
$columns = \DB::select("DESCRIBE departments");
$columnNames = array_column($columns, 'Field');

echo "\nDepartments table columns:\n";
foreach ($columnNames as $col) {
    echo "  - $col\n";
}

$required = ['id', 'name', 'code', 'head_id', 'parent_id', 'deleted_at'];
$missing = array_diff($required, $columnNames);

if (empty($missing)) {
    echo "\n✓ All required columns exist!\n";
} else {
    echo "\n⚠ Missing columns: " . implode(', ', $missing) . "\n";
}
