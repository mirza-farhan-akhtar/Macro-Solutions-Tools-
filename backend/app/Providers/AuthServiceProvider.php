<?php

namespace App\Providers;

use App\Models\Department;
use App\Models\Project;
use App\Models\ProjectTask;
use App\Models\DepartmentProjectRequest;
use App\Policies\DepartmentPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\ProjectTaskPolicy;
use App\Policies\DepartmentProjectRequestPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Department::class => DepartmentPolicy::class,
        Project::class => ProjectPolicy::class,
        ProjectTask::class => ProjectTaskPolicy::class,
        DepartmentProjectRequest::class => DepartmentProjectRequestPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
