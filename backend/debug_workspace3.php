<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

echo "=== meetings table columns ===\n";
echo implode(', ', Schema::getColumnListing('meetings')) . "\n";

echo "\n=== meetings data sample ===\n";
$meetings = DB::table('meetings')->take(3)->get();
foreach ($meetings as $m) {
    echo json_encode($m) . "\n";
}

echo "\n=== Project model relationships ===\n";
$proj = \App\Models\Project::find(11);
if ($proj) {
    echo "Project 11 columns: " . implode(', ', array_keys($proj->toArray())) . "\n";
}

echo "\n=== Users with department assignments ===\n";
$users = \App\Models\User::with('roles')->where('department_id', '!=', null)->get(['id', 'name', 'email', 'department_id']);
foreach ($users as $u) {
    echo "  user:{$u->name} dept_id:{$u->department_id} roles:" . $u->roles->pluck('slug')->implode(',') . "\n";
}
echo "Total users with no dept: " . \App\Models\User::whereNull('department_id')->count() . "\n";
