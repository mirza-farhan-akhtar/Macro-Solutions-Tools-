<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class HRPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create HR Permissions
        $permissions = [
            [
                'name' => 'hr.view',
                'slug' => 'hr.view',
                'description' => 'View HR module and dashboard',
                'module' => 'hr'
            ],
            [
                'name' => 'hr.create',
                'slug' => 'hr.create',
                'description' => 'Create HR records',
                'module' => 'hr'
            ],
            [
                'name' => 'hr.edit',
                'slug' => 'hr.edit',
                'description' => 'Edit HR records',
                'module' => 'hr'
            ],
            [
                'name' => 'hr.delete',
                'slug' => 'hr.delete',
                'description' => 'Delete HR records',
                'module' => 'hr'
            ],
            [
                'name' => 'hr.manage',
                'slug' => 'hr.manage',
                'description' => 'Manage all HR operations',
                'module' => 'hr'
            ],
            [
                'name' => 'hr.recruitment',
                'slug' => 'hr.recruitment',
                'description' => 'Manage recruitment and interviews',
                'module' => 'hr'
            ],
            [
                'name' => 'hr.employees',
                'slug' => 'hr.employees',
                'description' => 'Manage employee records',
                'module' => 'hr'
            ],
            [
                'name' => 'hr.attendance',
                'slug' => 'hr.attendance',
                'description' => 'Manage attendance records',
                'module' => 'hr'
            ],
            [
                'name' => 'hr.leave',
                'slug' => 'hr.leave',
                'description' => 'Manage leave requests',
                'module' => 'hr'
            ],
            [
                'name' => 'hr.payroll',
                'slug' => 'hr.payroll',
                'description' => 'Manage payroll',
                'module' => 'hr'
            ],
            [
                'name' => 'hr.performance',
                'slug' => 'hr.performance',
                'description' => 'Manage performance reviews',
                'module' => 'hr'
            ],
            [
                'name' => 'hr.reports',
                'slug' => 'hr.reports',
                'description' => 'View HR reports',
                'module' => 'hr'
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                [
                    'slug' => $permission['slug'],
                    'description' => $permission['description'],
                    'module' => $permission['module'],
                ]
            );
        }

        // Create HR Manager role if doesn't exist
        $hrManagerRole = Role::firstOrCreate(
            ['slug' => 'hr-manager'],
            [
                'name' => 'HR Manager',
                'description' => 'Can manage all HR operations',
            ]
        );

        // Assign all HR permissions to HR Manager
        $hrPermissions = Permission::whereIn('slug', [
            'hr.view',
            'hr.create',
            'hr.edit',
            'hr.delete',
            'hr.manage',
            'hr.recruitment',
            'hr.employees',
            'hr.attendance',
            'hr.leave',
            'hr.payroll',
            'hr.performance',
            'hr.reports',
        ])->pluck('id')->toArray();

        $hrManagerRole->permissions()->sync($hrPermissions, false);

        // Create HR Executive role
        $hrExecutiveRole = Role::firstOrCreate(
            ['slug' => 'hr-executive'],
            [
                'name' => 'HR Executive',
                'description' => 'Can manage recruitment and employees',
            ]
        );

        $executivePermissions = Permission::whereIn('slug', [
            'hr.view',
            'hr.create',
            'hr.edit',
            'hr.recruitment',
            'hr.employees',
            'hr.attendance',
        ])->pluck('id')->toArray();

        $hrExecutiveRole->permissions()->sync($executivePermissions, false);

        // Assign to Admin and Super Admin
        $adminRole = Role::where('slug', 'admin')->first();
        $superAdminRole = Role::where('slug', 'super-admin')->first();

        if ($adminRole) {
            $adminRole->permissions()->syncWithoutDetaching($hrPermissions);
        }

        if ($superAdminRole) {
            $superAdminRole->permissions()->syncWithoutDetaching($hrPermissions);
        }
    }
}
