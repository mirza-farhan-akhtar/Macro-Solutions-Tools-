<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class CRMPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create CRM Permissions
        $permissions = [
            ['name' => 'CRM Dashboard', 'slug' => 'crm.dashboard', 'module' => 'crm', 'description' => 'View CRM dashboard'],
            ['name' => 'Manage Leads', 'slug' => 'crm.lead.manage', 'module' => 'crm', 'description' => 'Create, edit, delete leads'],
            ['name' => 'Manage Deals', 'slug' => 'crm.deal.manage', 'module' => 'crm', 'description' => 'Manage deals and pipeline'],
            ['name' => 'Manage Clients', 'slug' => 'crm.client.manage', 'module' => 'crm', 'description' => 'Manage clients and companies'],
            ['name' => 'Manage Contacts', 'slug' => 'crm.contact.manage', 'module' => 'crm', 'description' => 'Manage client contacts'],
            ['name' => 'Manage Proposals', 'slug' => 'crm.proposal.manage', 'module' => 'crm', 'description' => 'Create and send proposals'],
            ['name' => 'Manage Activities', 'slug' => 'crm.activity.manage', 'module' => 'crm', 'description' => 'Track activities and follow-ups'],
            ['name' => 'View Reports', 'slug' => 'crm.report.view', 'module' => 'crm', 'description' => 'View CRM reports and analytics'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }

        // Assign permissions to Sales Manager role (create if doesn't exist)
        $salesManagerRole = Role::firstOrCreate(
            ['slug' => 'sales-manager'],
            [
                'name' => 'Sales Manager',
                'description' => 'Sales manager for CRM',
            ]
        );

        $crmPermissions = Permission::where('module', 'crm')->get();
        $salesManagerRole->permissions()->syncWithoutDetaching($crmPermissions->pluck('id'));

        // Assign permissions to Sales Executive role
        $salesExecutiveRole = Role::firstOrCreate(
            ['slug' => 'sales-executive'],
            [
                'name' => 'Sales Executive',
                'description' => 'Sales executive for CRM',
            ]
        );

        // Sales exec has fewer permissions (can't delete, can only view reports)
        $salesExecPermissions = Permission::where('module', 'crm')
            ->whereNotIn('slug', ['crm.deal.manage', 'crm.client.manage'])
            ->get();
        $salesExecutiveRole->permissions()->syncWithoutDetaching($salesExecPermissions->pluck('id'));
    }
}
