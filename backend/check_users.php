<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== Checking Users ===\n\n";

$users = User::all();
echo "Total users in database: " . count($users) . "\n\n";

if (count($users) > 0) {
    echo "Existing users:\n";
    foreach ($users as $user) {
        echo "- " . $user->email . " (" . $user->name . ")\n";
    }
} else {
    echo "No users found! Creating test users...\n\n";
    
    // Create admin user
    $admin = User::create([
        'name' => 'Admin',
        'email' => 'admin@macro.com',
        'password' => Hash::make('password'),
        'role' => 'admin',
        'status' => 'active',
    ]);
    $admin->assignRole('super-admin');
    echo "✓ Created: admin@macro.com (Admin)\n";
    
    // Create HR Manager
    $hr = User::create([
        'name' => 'HR Manager',
        'email' => 'hr@macro.com',
        'password' => Hash::make('password'),
        'role' => 'user',
        'status' => 'active',
    ]);
    $hr->assignRole('hr-manager');
    echo "✓ Created: hr@macro.com (HR Manager)\n";
    
    // Create Finance Manager
    $finance = User::create([
        'name' => 'Finance Manager',
        'email' => 'finance@macro.com',
        'password' => Hash::make('password'),
        'role' => 'user',
        'status' => 'active',
    ]);
    $finance->assignRole('finance-manager');
    echo "✓ Created: finance@macro.com (Finance Manager)\n";
    
    // Create regular user
    $user = User::create([
        'name' => 'John Doe',
        'email' => 'user@macro.com',
        'password' => Hash::make('password'),
        'role' => 'user',
        'status' => 'active',
    ]);
    echo "✓ Created: user@macro.com (John Doe)\n";
    
    echo "\n✅ Test users created successfully!\n";
}

echo "\n=== Login Credentials ===\n";
echo "Admin:           admin@macro.com / password\n";
echo "HR Manager:      hr@macro.com / password\n";
echo "Finance Manager: finance@macro.com / password\n";
echo "User:            user@macro.com / password\n";
