<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\PerformanceReview;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class HRSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        
        // Create sample employees
        $departments = ['IT', 'Finance', 'HR', 'Sales', 'Marketing'];
        $employmentTypes = ['Full-time', 'Part-time', 'Contract'];
        
        for ($i = 1; $i <= 10; $i++) {
            Employee::create([
                'employee_id' => 'EMP-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'full_name' => $faker->name(),
                'email' => $faker->unique()->safeEmail(),
                'phone' => $faker->phoneNumber(),
                'department' => $departments[array_rand($departments)],
                'designation' => ['Manager', 'Executive', 'Intern', 'Lead'][rand(0, 3)],
                'joining_date' => $faker->dateTimeBetween('-2 years', 'now'),
                'employment_type' => $employmentTypes[array_rand($employmentTypes)],
                'salary' => rand(30000, 150000),
                'status' => 'Active',
                'address' => $faker->address(),
                'date_of_birth' => $faker->dateTimeBetween('-60 years', '-18 years'),
                'gender' => ['Male', 'Female'][rand(0, 1)],
            ]);
        }

        echo "✓ HR module seeded successfully!\n";
        echo "- 10 employees created\n";
    }
}
