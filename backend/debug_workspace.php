<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Departments in DB ===\n";
$depts = \App\Models\Department::all(['id', 'name', 'slug', 'code']);
foreach ($depts as $d) {
    echo "  ID:{$d->id}  slug:'" . ($d->slug ?? 'NULL') . "'  name:'{$d->name}'\n";
}

echo "\n=== Projects in DB ===\n";
$projects = \App\Models\Project::all(['id', 'name', 'primary_department_id', 'status']);
foreach ($projects as $p) {
    echo "  ID:{$p->id}  dept_id:" . ($p->primary_department_id ?? 'NULL') . "  name:'{$p->name}'  status:{$p->status}\n";
}

echo "\n=== Test dept projects query per dept ===\n";
foreach ($depts as $d) {
    $count = \App\Models\Project::where('primary_department_id', $d->id)
        ->orWhereHas('departments', function ($q) use ($d) {
            $q->where('department_id', $d->id);
        })->count();
    echo "  Dept '{$d->name}': {$count} projects\n";
}
