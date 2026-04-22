<?php
require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Http\Kernel');
$response = $kernel->handle($request = \Illuminate\Http\Request::capture());

try {
    // Use route model binding to resolve the department by slug
    $departmentSlug = 'human-resources';
    $department = \App\Models\Department::where('slug', $departmentSlug)->first();
    
    if (!$department) {
        echo "Department not found!\n";
        return;
    }
    
    echo "Department ID: " . $department->id . "\n";
    echo "Department Name: " . $department->name . "\n";
    echo "Department Slug: " . $department->slug . "\n\n";
    
    // Get projects using the same query as in the controller
    $projects = \App\Models\Project::where('primary_department_id', $department->id)
        ->with('creator')
        ->get();
    
    echo "Projects query:\n";
    echo "SELECT * FROM projects WHERE primary_department_id = " . $department->id . "\n\n";
    echo "Projects count: " . count($projects) . "\n";
    foreach ($projects as $p) {
        echo "- " . $p->name . " (code: " . $p->code . ", dept_id: " . $p->primary_department_id . ")\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "Trace:\n" . $e->getTraceAsString() . "\n";
}
