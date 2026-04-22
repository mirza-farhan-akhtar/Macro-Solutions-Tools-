<?php
require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Http\Kernel');
$response = $kernel->handle($request = \Illuminate\Http\Request::capture());

try {
    // Get department
    $department = \App\Models\Department::find(1);
    echo "Department ID: " . $department->id . "\n";
    echo "Department Name: " . $department->name . "\n";
    
    // Get projects
    $projects = \App\Models\Project::where('primary_department_id', $department->id)
        ->with('created_by')
        ->get();
    
    echo "Projects count: " . count($projects) . "\n";
    foreach ($projects as $p) {
        echo "- " . $p->name . " (code: " . $p->code . ", dept: " . $p->primary_department_id . ")\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
