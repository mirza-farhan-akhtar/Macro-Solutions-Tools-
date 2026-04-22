<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Dashboard Module
            ['name' => 'View Dashboard', 'slug' => 'dashboard.view', 'module' => 'dashboard', 'description' => 'View admin dashboard'],

            // Users Module
            ['name' => 'View Users', 'slug' => 'users.view', 'module' => 'users', 'description' => 'View list of users'],
            ['name' => 'Create Users', 'slug' => 'users.create', 'module' => 'users', 'description' => 'Create new users'],
            ['name' => 'Edit Users', 'slug' => 'users.edit', 'module' => 'users', 'description' => 'Edit existing users'],
            ['name' => 'Delete Users', 'slug' => 'users.delete', 'module' => 'users', 'description' => 'Delete users'],

            // Roles Module
            ['name' => 'View Roles', 'slug' => 'roles.view', 'module' => 'roles', 'description' => 'View list of roles'],
            ['name' => 'Create Roles', 'slug' => 'roles.create', 'module' => 'roles', 'description' => 'Create new roles'],
            ['name' => 'Edit Roles', 'slug' => 'roles.edit', 'module' => 'roles', 'description' => 'Edit existing roles'],
            ['name' => 'Delete Roles', 'slug' => 'roles.delete', 'module' => 'roles', 'description' => 'Delete roles'],

            // Permissions Module
            ['name' => 'View Permissions', 'slug' => 'permissions.view', 'module' => 'permissions', 'description' => 'View list of permissions'],
            ['name' => 'Create Permissions', 'slug' => 'permissions.create', 'module' => 'permissions', 'description' => 'Create new permissions'],
            ['name' => 'Edit Permissions', 'slug' => 'permissions.edit', 'module' => 'permissions', 'description' => 'Edit existing permissions'],
            ['name' => 'Delete Permissions', 'slug' => 'permissions.delete', 'module' => 'permissions', 'description' => 'Delete permissions'],

            // Services Module
            ['name' => 'View Services', 'slug' => 'services.view', 'module' => 'services', 'description' => 'View services'],
            ['name' => 'Create Services', 'slug' => 'services.create', 'module' => 'services', 'description' => 'Create new services'],
            ['name' => 'Edit Services', 'slug' => 'services.edit', 'module' => 'services', 'description' => 'Edit services'],
            ['name' => 'Delete Services', 'slug' => 'services.delete', 'module' => 'services', 'description' => 'Delete services'],

            // AI Services Module
            ['name' => 'View AI Services', 'slug' => 'ai-services.view', 'module' => 'ai-services', 'description' => 'View AI services'],
            ['name' => 'Create AI Services', 'slug' => 'ai-services.create', 'module' => 'ai-services', 'description' => 'Create new AI services'],
            ['name' => 'Edit AI Services', 'slug' => 'ai-services.edit', 'module' => 'ai-services', 'description' => 'Edit AI services'],
            ['name' => 'Delete AI Services', 'slug' => 'ai-services.delete', 'module' => 'ai-services', 'description' => 'Delete AI services'],

            // Blogs Module
            ['name' => 'View Blogs', 'slug' => 'blogs.view', 'module' => 'blogs', 'description' => 'View blogs'],
            ['name' => 'Create Blogs', 'slug' => 'blogs.create', 'module' => 'blogs', 'description' => 'Create new blogs'],
            ['name' => 'Edit Blogs', 'slug' => 'blogs.edit', 'module' => 'blogs', 'description' => 'Edit blogs'],
            ['name' => 'Delete Blogs', 'slug' => 'blogs.delete', 'module' => 'blogs', 'description' => 'Delete blogs'],

            // FAQs Module
            ['name' => 'View FAQs', 'slug' => 'faqs.view', 'module' => 'faqs', 'description' => 'View FAQs'],
            ['name' => 'Create FAQs', 'slug' => 'faqs.create', 'module' => 'faqs', 'description' => 'Create new FAQs'],
            ['name' => 'Edit FAQs', 'slug' => 'faqs.edit', 'module' => 'faqs', 'description' => 'Edit FAQs'],
            ['name' => 'Delete FAQs', 'slug' => 'faqs.delete', 'module' => 'faqs', 'description' => 'Delete FAQs'],

            // Team Module
            ['name' => 'View Team', 'slug' => 'team.view', 'module' => 'team', 'description' => 'View team members'],
            ['name' => 'Create Team', 'slug' => 'team.create', 'module' => 'team', 'description' => 'Create new team members'],
            ['name' => 'Edit Team', 'slug' => 'team.edit', 'module' => 'team', 'description' => 'Edit team members'],
            ['name' => 'Delete Team', 'slug' => 'team.delete', 'module' => 'team', 'description' => 'Delete team members'],

            // Careers Module
            ['name' => 'View Careers', 'slug' => 'careers.view', 'module' => 'careers', 'description' => 'View careers'],
            ['name' => 'Create Careers', 'slug' => 'careers.create', 'module' => 'careers', 'description' => 'Create new careers'],
            ['name' => 'Edit Careers', 'slug' => 'careers.edit', 'module' => 'careers', 'description' => 'Edit careers'],
            ['name' => 'Delete Careers', 'slug' => 'careers.delete', 'module' => 'careers', 'description' => 'Delete careers'],

            // Applications Module
            ['name' => 'View Applications', 'slug' => 'applications.view', 'module' => 'applications', 'description' => 'View job applications'],
            ['name' => 'Edit Applications', 'slug' => 'applications.edit', 'module' => 'applications', 'description' => 'Edit applications'],
            ['name' => 'Delete Applications', 'slug' => 'applications.delete', 'module' => 'applications', 'description' => 'Delete applications'],

            // Leads Module
            ['name' => 'View Leads', 'slug' => 'leads.view', 'module' => 'leads', 'description' => 'View leads'],
            ['name' => 'Create Leads', 'slug' => 'leads.create', 'module' => 'leads', 'description' => 'Create new leads'],
            ['name' => 'Edit Leads', 'slug' => 'leads.edit', 'module' => 'leads', 'description' => 'Edit leads'],
            ['name' => 'Delete Leads', 'slug' => 'leads.delete', 'module' => 'leads', 'description' => 'Delete leads'],

            // Appointments Module
            ['name' => 'View Appointments', 'slug' => 'appointments.view', 'module' => 'appointments', 'description' => 'View appointments'],
            ['name' => 'Create Appointments', 'slug' => 'appointments.create', 'module' => 'appointments', 'description' => 'Create new appointments'],
            ['name' => 'Edit Appointments', 'slug' => 'appointments.edit', 'module' => 'appointments', 'description' => 'Edit appointments'],
            ['name' => 'Delete Appointments', 'slug' => 'appointments.delete', 'module' => 'appointments', 'description' => 'Delete appointments'],

            // Pages Module
            ['name' => 'View Pages', 'slug' => 'pages.view', 'module' => 'pages', 'description' => 'View pages'],
            ['name' => 'Create Pages', 'slug' => 'pages.create', 'module' => 'pages', 'description' => 'Create new pages'],
            ['name' => 'Edit Pages', 'slug' => 'pages.edit', 'module' => 'pages', 'description' => 'Edit pages'],
            ['name' => 'Delete Pages', 'slug' => 'pages.delete', 'module' => 'pages', 'description' => 'Delete pages'],

            // Settings Module
            ['name' => 'View Settings', 'slug' => 'settings.view', 'module' => 'settings', 'description' => 'View settings'],
            ['name' => 'Edit Settings', 'slug' => 'settings.edit', 'module' => 'settings', 'description' => 'Manage system settings'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }
    }
}
