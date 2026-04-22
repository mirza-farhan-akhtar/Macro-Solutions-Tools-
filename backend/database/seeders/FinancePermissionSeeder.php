<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class FinancePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Finance Permissions
        $permissions = [
            [
                'name' => 'finance.view',
                'slug' => 'finance.view',
                'description' => 'View financial data',
                'module' => 'finance'
            ],
            [
                'name' => 'finance.create',
                'slug' => 'finance.create',
                'description' => 'Create invoices, expenses, and income',
                'module' => 'finance'
            ],
            [
                'name' => 'finance.edit',
                'slug' => 'finance.edit',
                'description' => 'Edit financial records',
                'module' => 'finance'
            ],
            [
                'name' => 'finance.delete',
                'slug' => 'finance.delete',
                'description' => 'Delete financial records',
                'module' => 'finance'
            ],
            [
                'name' => 'finance.reports',
                'slug' => 'finance.reports',
                'description' => 'Access financial reports and analytics',
                'module' => 'finance'
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

        // Assign permissions to roles
        $adminRole = Role::where('name', 'Admin')->first();
        $superAdminRole = Role::where('name', 'Super Admin')->first();
        $financeManagerRole = Role::where('name', 'Finance Manager')->first();
        $accountantRole = Role::where('name', 'Accountant')->first();

        // Get ALL finance permission IDs
        $allFinancePermissions = Permission::whereIn('name', [
            'finance.view',
            'finance.create', 
            'finance.edit',
            'finance.delete',
            'finance.reports'
        ])->pluck('id')->toArray();

        // Assign to Admin
        if ($adminRole) {
            $adminRole->permissions()->sync($allFinancePermissions, false);
        }

        // Assign to Super Admin (should have all)
        if ($superAdminRole) {
            $superAdminRole->permissions()->sync($allFinancePermissions, false);
        }

        // Create Finance Manager role if doesn't exist
        if (!$financeManagerRole) {
            $financeManagerRole = Role::create([
                'name' => 'Finance Manager',
                'slug' => 'finance-manager',
                'description' => 'Can manage all finance operations',
            ]);
        }
        
        // ENSURE Finance Manager has ALL finance permissions
        $financeManagerPermissions = Permission::whereIn('name', [
            'finance.view',
            'finance.create',
            'finance.edit',
            'finance.reports'
        ])->pluck('id')->toArray();
        
        $financeManagerRole->permissions()->sync($financeManagerPermissions, false);

        // Create Accountant role if doesn't exist
        if (!$accountantRole) {
            $accountantRole = Role::create([
                'name' => 'Accountant',
                'slug' => 'accountant',
                'description' => 'Can view and analyze financial data',
            ]);
        }
        
        // Assign only finance.view and finance.reports to Accountant
        $accountantPermissions = Permission::whereIn('name', [
            'finance.view',
            'finance.reports'
        ])->pluck('id')->toArray();
        
        $accountantRole->permissions()->sync($accountantPermissions, false);
    }
}
