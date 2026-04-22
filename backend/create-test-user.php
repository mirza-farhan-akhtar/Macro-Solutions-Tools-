<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Role;

try {
    // Create or get user
    $user = User::firstOrCreate(
        ['email' => 'hr@macro.com'],
        [
            'name' => 'HR Manager',
            'password' => bcrypt('password'),
            'status' => 'active'
        ]
    );

    // Create token
    $token = $user->createToken('test-token')->plainTextToken;

    // Assign HR Manager role
    $role = Role::where('name', 'hr-manager')->first();
    if ($role) {
        $user->roles()->sync([$role->id]);
        echo "✓ User created/updated: " . $user->email . "\n";
        echo "✓ Token: " . $token . "\n";
        echo "✓ Role assigned: hr-manager\n";
    } else {
        echo "✗ HR Manager role not found\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
