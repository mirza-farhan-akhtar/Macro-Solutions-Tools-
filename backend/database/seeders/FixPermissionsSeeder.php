<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class FixPermissionsSeeder extends Seeder
{
    /**
     * Fix all role permission assignments and create missing test users.
     * This seeder aligns DB permissions with the actual route middleware slugs.
     */
    public function run(): void
    {
        $this->command->info('Fixing role permission assignments...');

        // ─────────────────────────────────────────────
        // SUPER ADMIN — gets every permission
        // ─────────────────────────────────────────────
        $superAdmin = Role::where('slug', 'super-admin')->first();
        if ($superAdmin) {
            $allIds = Permission::pluck('id');
            $superAdmin->permissions()->sync($allIds);
            $this->command->info("Super Admin: synced {$allIds->count()} permissions.");
        }

        // ─────────────────────────────────────────────
        // ADMIN — most permissions except system-only
        // ─────────────────────────────────────────────
        $admin = Role::where('slug', 'admin')->first();
        if ($admin) {
            $slugs = [
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
            ];
            $ids = Permission::whereIn('slug', $slugs)->pluck('id');
            $admin->permissions()->sync($ids);
            $this->command->info("Admin: synced {$ids->count()} permissions.");
        }

        // ─────────────────────────────────────────────
        // FINANCE MANAGER — full finance access
        // ─────────────────────────────────────────────
        $financeManager = Role::where('slug', 'finance-manager')->first();
        if ($financeManager) {
            $slugs = [
                'dashboard.view',
                'finance.view', 'finance.create', 'finance.edit', 'finance.delete', 'finance.reports',
            ];
            $ids = Permission::whereIn('slug', $slugs)->pluck('id');
            $financeManager->permissions()->sync($ids);
            $this->command->info("Finance Manager: synced {$ids->count()} permissions.");
        }

        // ─────────────────────────────────────────────
        // ACCOUNTANT — finance view + reports + create/edit (no delete)
        // ─────────────────────────────────────────────
        $accountant = Role::where('slug', 'accountant')->first();
        if ($accountant) {
            $slugs = [
                'dashboard.view',
                'finance.view', 'finance.create', 'finance.edit', 'finance.reports',
            ];
            $ids = Permission::whereIn('slug', $slugs)->pluck('id');
            $accountant->permissions()->sync($ids);
            $this->command->info("Accountant: synced {$ids->count()} permissions.");
        }

        // ─────────────────────────────────────────────
        // HR MANAGER — full HR access + careers + applications
        // ─────────────────────────────────────────────
        $hrManager = Role::where('slug', 'hr-manager')->first();
        if ($hrManager) {
            $slugs = [
                'dashboard.view',
                'hr.view', 'hr.create', 'hr.edit', 'hr.delete', 'hr.manage',
                'hr.recruitment', 'hr.employees', 'hr.attendance', 'hr.leave',
                'hr.payroll', 'hr.performance', 'hr.reports',
                'careers.view', 'careers.create', 'careers.edit', 'careers.delete',
                'applications.view', 'applications.edit', 'applications.delete',
                'department.view', 'department.create', 'department.edit',
                'department.assign.users',
            ];
            $ids = Permission::whereIn('slug', $slugs)->pluck('id');
            $hrManager->permissions()->sync($ids);
            $this->command->info("HR Manager: synced {$ids->count()} permissions.");
        }

        // ─────────────────────────────────────────────
        // HR EXECUTIVE — limited HR (no payroll/delete)
        // ─────────────────────────────────────────────
        $hrExecutive = Role::where('slug', 'hr-executive')->first();
        if ($hrExecutive) {
            $slugs = [
                'dashboard.view',
                'hr.view', 'hr.create', 'hr.edit',
                'hr.employees', 'hr.attendance', 'hr.leave',
                'hr.performance', 'hr.recruitment', 'hr.reports',
                'careers.view', 'applications.view',
            ];
            $ids = Permission::whereIn('slug', $slugs)->pluck('id');
            $hrExecutive->permissions()->sync($ids);
            $this->command->info("HR Executive: synced {$ids->count()} permissions.");
        }

        // ─────────────────────────────────────────────
        // CRM MANAGER — full CRM + leads management
        // ─────────────────────────────────────────────
        $crmManager = Role::where('slug', 'crm-manager')->first();
        if ($crmManager) {
            $slugs = [
                'dashboard.view',
                'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
                'appointments.view', 'appointments.create', 'appointments.edit', 'appointments.delete',
                'crm.dashboard', 'crm.lead.manage', 'crm.client.manage', 'crm.deal.manage',
                'crm.proposal.manage', 'crm.activity.manage', 'crm.report.view',
            ];
            $ids = Permission::whereIn('slug', $slugs)->pluck('id');
            $crmManager->permissions()->sync($ids);
            $this->command->info("CRM Manager: synced {$ids->count()} permissions.");
        }

        // ─────────────────────────────────────────────
        // CONTENT MANAGER — content & cms management
        // ─────────────────────────────────────────────
        $contentManager = Role::where('slug', 'content-manager')->first();
        if ($contentManager) {
            $slugs = [
                'dashboard.view',
                'blogs.view', 'blogs.create', 'blogs.edit', 'blogs.delete',
                'faqs.view', 'faqs.create', 'faqs.edit', 'faqs.delete',
                'team.view', 'team.create', 'team.edit', 'team.delete',
                'services.view', 'services.create', 'services.edit', 'services.delete',
                'ai-services.view', 'ai-services.create', 'ai-services.edit', 'ai-services.delete',
                'pages.view', 'pages.create', 'pages.edit', 'pages.delete',
                'careers.view',
            ];
            $ids = Permission::whereIn('slug', $slugs)->pluck('id');
            $contentManager->permissions()->sync($ids);
            $this->command->info("Content Manager: synced {$ids->count()} permissions.");
        }

        // ─────────────────────────────────────────────
        // VIEWER — all *.view permissions (read-only)
        // ─────────────────────────────────────────────
        $viewer = Role::where('slug', 'viewer')->first();
        if ($viewer) {
            $ids = Permission::where('slug', 'like', '%.view')
                ->orWhere('slug', 'like', '%.reports')
                ->pluck('id');
            $viewer->permissions()->sync($ids);
            $this->command->info("Viewer: synced {$ids->count()} permissions.");
        }

        // ─────────────────────────────────────────────
        // CREATE MISSING TEST USERS
        // ─────────────────────────────────────────────
        $this->createMissingUsers();

        $this->command->info('✅ All role permissions fixed successfully!');
    }

    private function createMissingUsers(): void
    {
        $users = [
            [
                'name'     => 'CRM Manager',
                'email'    => 'crm@macro.com',
                'password' => 'password',
                'role'     => 'user',
                'roleSlug' => 'crm-manager',
            ],
            [
                'name'     => 'Content Manager',
                'email'    => 'content@macro.com',
                'password' => 'password',
                'role'     => 'user',
                'roleSlug' => 'content-manager',
            ],
            [
                'name'     => 'Accountant',
                'email'    => 'accountant@macro.com',
                'password' => 'password',
                'role'     => 'user',
                'roleSlug' => 'accountant',
            ],
            [
                'name'     => 'HR Executive',
                'email'    => 'hrexec@macro.com',
                'password' => 'password',
                'role'     => 'user',
                'roleSlug' => 'hr-executive',
            ],
            [
                'name'     => 'Viewer User',
                'email'    => 'viewer@macro.com',
                'password' => 'password',
                'role'     => 'user',
                'roleSlug' => 'viewer',
            ],
        ];

        foreach ($users as $userData) {
            $roleSlug = $userData['roleSlug'];
            unset($userData['roleSlug']);

            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                array_merge($userData, ['password' => Hash::make($userData['password'])])
            );

            $role = Role::where('slug', $roleSlug)->first();
            if ($role && !$user->roles()->where('slug', $roleSlug)->exists()) {
                $user->roles()->attach($role->id);
                $this->command->info("Created/updated user: {$userData['email']} with role {$roleSlug}");
            }
        }
    }
}
