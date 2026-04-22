<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $roles = [
            [
                'name' => 'Super Admin',
                'slug' => 'super-admin',
                'description' => 'Has full access to all system features and permissions'
            ],
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Has access to most administrative features'
            ],
            [
                'name' => 'Finance Manager',
                'slug' => 'finance-manager',
                'description' => 'Manages financial records and transactions'
            ],
            [
                'name' => 'HR Manager',
                'slug' => 'hr-manager',
                'description' => 'Manages human resources and recruitment'
            ],
            [
                'name' => 'CRM Manager',
                'slug' => 'crm-manager',
                'description' => 'Manages customer relationship and leads'
            ],
            [
                'name' => 'Content Manager',
                'slug' => 'content-manager',
                'description' => 'Manages website content and blogs'
            ],
            [
                'name' => 'Viewer',
                'slug' => 'viewer',
                'description' => 'Read-only access to view data'
            ],
        ];

        foreach ($roles as $roleData) {
            Role::updateOrCreate(
                ['slug' => $roleData['slug']],
                $roleData
            );
        }

        // Assign permissions to roles
        $this->assignPermissions();
    }

    private function assignPermissions()
    {
        $allPermissions = Permission::all();
        
        // Super Admin gets all permissions
        $superAdmin = Role::where('slug', 'super-admin')->first();
        $superAdmin->permissions()->sync($allPermissions->pluck('id'));

        // Admin gets most permissions except super-admin-exclusive ones
        $admin = Role::where('slug', 'admin')->first();
        $adminPermissions = Permission::whereIn('slug', [
            'dashboard.view',
            'users.view', 'users.create', 'users.edit', 'users.delete',
            'roles.view', 'roles.create', 'roles.edit',
            'permissions.view',
            'services.view', 'services.create', 'services.edit', 'services.delete',
            'ai-services.view', 'ai-services.create', 'ai-services.edit', 'ai-services.delete',
            'blogs.view', 'blogs.create', 'blogs.edit', 'blogs.delete',
            'faqs.view', 'faqs.create', 'faqs.edit', 'faqs.delete',
            'team.view', 'team.create', 'team.edit', 'team.delete',
            'careers.view', 'careers.create', 'careers.edit', 'careers.delete',
            'applications.view', 'applications.edit', 'applications.delete',
            'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
            'appointments.view', 'appointments.create', 'appointments.edit', 'appointments.delete',
            'pages.view', 'pages.create', 'pages.edit', 'pages.delete',
            'settings.view', 'settings.edit',
            'finance.view', 'finance.create', 'finance.edit', 'finance.delete', 'finance.reports',
            'hr.view', 'hr.create', 'hr.edit', 'hr.delete', 'hr.manage',
            'hr.recruitment', 'hr.employees', 'hr.attendance', 'hr.leave',
            'hr.payroll', 'hr.performance', 'hr.reports',
            'crm.dashboard', 'crm.lead.manage', 'crm.client.manage', 'crm.deal.manage',
            'crm.proposal.manage', 'crm.activity.manage', 'crm.report.view',
            'department.view', 'department.create', 'department.edit', 'department.delete',
            'department.assign.users',
        ])->pluck('id');
        $admin->permissions()->sync($adminPermissions);

        // Finance Manager
        $financeManager = Role::where('slug', 'finance-manager')->first();
        $financePermissions = Permission::whereIn('slug', [
            'dashboard.view',
            'finance.view', 'finance.create', 'finance.edit', 'finance.delete', 'finance.reports',
        ])->pluck('id');
        $financeManager->permissions()->sync($financePermissions);

        // HR Manager
        $hrManager = Role::where('slug', 'hr-manager')->first();
        $hrPermissions = Permission::whereIn('slug', [
            'dashboard.view',
            'hr.view', 'hr.create', 'hr.edit', 'hr.delete', 'hr.manage',
            'hr.recruitment', 'hr.employees', 'hr.attendance', 'hr.leave',
            'hr.payroll', 'hr.performance', 'hr.reports',
            'careers.view', 'careers.create', 'careers.edit', 'careers.delete',
            'applications.view', 'applications.edit', 'applications.delete',
            'department.view', 'department.create', 'department.edit',
            'department.assign.users',
        ])->pluck('id');
        $hrManager->permissions()->sync($hrPermissions);

        // CRM Manager
        $crmManager = Role::where('slug', 'crm-manager')->first();
        $crmPermissions = Permission::whereIn('slug', [
            'dashboard.view',
            'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
            'appointments.view', 'appointments.create', 'appointments.edit', 'appointments.delete',
            'crm.dashboard', 'crm.lead.manage', 'crm.client.manage', 'crm.deal.manage',
            'crm.proposal.manage', 'crm.activity.manage', 'crm.report.view',
        ])->pluck('id');
        $crmManager->permissions()->sync($crmPermissions);

        // Content Manager
        $contentManager = Role::where('slug', 'content-manager')->first();
        $contentPermissions = Permission::whereIn('slug', [
            'dashboard.view',
            'blogs.view', 'blogs.create', 'blogs.edit', 'blogs.delete',
            'faqs.view', 'faqs.create', 'faqs.edit', 'faqs.delete',
            'team.view', 'team.create', 'team.edit', 'team.delete',
            'services.view', 'services.create', 'services.edit', 'services.delete',
            'ai-services.view', 'ai-services.create', 'ai-services.edit', 'ai-services.delete',
            'pages.view', 'pages.create', 'pages.edit', 'pages.delete',
            'careers.view',
        ])->pluck('id');
        $contentManager->permissions()->sync($contentPermissions);

        // Viewer
        $viewer = Role::where('slug', 'viewer')->first();
        $viewerPermissions = Permission::where('slug', 'like', '%.view')
            ->orWhere('slug', 'like', '%.reports')
            ->pluck('id');
        $viewer->permissions()->sync($viewerPermissions);
    }
}
