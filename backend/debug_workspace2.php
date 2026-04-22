<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== project_departments pivot ===\n";
$pivots = DB::table('project_departments')->get();
foreach ($pivots as $p) {
    echo "  project_id:{$p->project_id}  department_id:{$p->department_id}\n";
}

echo "\n=== Project model 'departments' relationship check ===\n";
$proj = \App\Models\Project::with('departments')->find(11);
if ($proj) {
    echo "  Project 11 departments: " . $proj->departments->pluck('name')->implode(', ') . "\n";
}

echo "\n=== Breaking down the OR query for each dept ===\n";
foreach ([1, 2] as $deptId) {
    $primary = \App\Models\Project::where('primary_department_id', $deptId)->pluck('id')->toArray();
    $pivot = \App\Models\Project::whereHas('departments', function($q) use ($deptId) {
        $q->where('department_id', $deptId);
    })->pluck('id')->toArray();
    echo "  Dept {$deptId}: primary=" . implode(',', $primary) . "  pivot=" . implode(',', $pivot) . "\n";
}

echo "\n=== meetings table ===\n";
$meetings = DB::table('meetings')->select('id', 'title', 'organizer_id', 'department_id')->get();
echo count($meetings) . " meetings\n";
foreach ($meetings as $m) {
    echo "  id:{$m->id}  title:'{$m->title}'  organizer:{$m->organizer_id}  dept:" . ($m->department_id ?? 'NULL') . "\n";
}
