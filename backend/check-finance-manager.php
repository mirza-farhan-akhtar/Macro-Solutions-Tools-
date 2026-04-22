<?php
// Quick check script to verify Finance Manager permissions

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);

// Get a Finance Manager user or create one
$user = \App\Models\User::where('email', 'finance@example.com')->first();
if (!$user) {
    // Check if there's any Finance Manager user
    $role = \App\Models\Role::where('slug', 'finance-manager')->first();
    if ($role) {
        $user = $role->users()->first();
    }
}

if ($user) {
    echo "User: " . $user->name . " (" . $user->email . ")\n";
    echo "Roles:\n";
    foreach ($user->roles as $role) {
        echo "  - " . $role->name . " (slug: " . $role->slug . ")\n";
    }
    echo "\nPermissions via getAllPermissions():\n";
    $perms = $user->getAllPermissions();
    foreach ($perms as $perm) {
        echo "  - " . $perm->name . " (slug: " . $perm->slug . ")\n";
    }
    echo "\nPermission slugs array (as backend returns):\n";
    $slugs = $perms->pluck('slug')->toArray();
    echo "  " . json_encode($slugs) . "\n";
} else {
    echo "No Finance Manager user found. Creating test user...\n";
    
    // Create Finance Manager user
    $user = \App\Models\User::create([
        'name' => 'Finance Manager Test',
        'email' => 'finance@example.com',
        'password' => \Illuminate\Support\Facades\Hash::make('password123'),
    ]);
    
    $role = \App\Models\Role::where('slug', 'finance-manager')->first();
    if ($role) {
        $user->roles()->attach($role);
        echo "Attached Finance Manager role to user\n";
        echo "User roles: " . json_encode($user->roles->pluck('slug')->toArray()) . "\n";
        echo "User permissions: " . json_encode($user->getAllPermissions()->pluck('slug')->toArray()) . "\n";
    } else {
        echo "ERROR: Finance Manager role not found in database!\n";
    }
}
?>
