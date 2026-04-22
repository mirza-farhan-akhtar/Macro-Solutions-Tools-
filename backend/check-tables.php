<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

try {
    // Check if attendance table exists
    if (Schema::hasTable('attendances')) {
        echo "✓ attendances table EXISTS\n";
        $columns = Schema::getColumnListing('attendances');
        echo "  Columns: " . implode(', ', $columns) . "\n";
    } else {
        echo "✗ attendances table DOES NOT EXIST\n";
    }

    // Check other HR tables
    $tables = ['employees', 'leave_requests', 'performance_reviews', 'interviews'];
    echo "\nOther HR tables:\n";
    foreach ($tables as $table) {
        $exists = Schema::hasTable($table) ? '✓' : '✗';
        echo "  $exists $table\n";
    }

    // Try to count attendance records
    try {
        $count = DB::table('attendances')->count();
        echo "\n✓ Attendance records: $count\n";
    } catch (\Exception $e) {
        echo "\n✗ Cannot query attendance table: " . $e->getMessage() . "\n";
    }

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
