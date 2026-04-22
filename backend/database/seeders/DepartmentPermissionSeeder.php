<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class DepartmentPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'View Departments', 'slug' => 'department.view', 'module' => 'hr', 'description' => 'View department information'],
            ['name' => 'Create Department', 'slug' => 'department.create', 'module' => 'hr', 'description' => 'Create new departments'],
            ['name' => 'Edit Department', 'slug' => 'department.edit', 'module' => 'hr', 'description' => 'Edit department details'],
            ['name' => 'Delete Department', 'slug' => 'department.delete', 'module' => 'hr', 'description' => 'Delete departments'],
            ['name' => 'Assign Users to Department', 'slug' => 'department.assign.users', 'module' => 'hr', 'description' => 'Assign employees to departments'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }
    }
}
