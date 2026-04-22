<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Role;

try {
    // Get hr user
    $user = User::where('email', 'hr@macro.com')->first();
    if (!$user) {
        echo "HR user not found\n";
        exit;
    }

    echo "User: " . $user->email . "\n";
    echo "Current roles:\n";
    
    $roles = $user->roles;
    if ($roles->isEmpty()) {
        echo "  - No roles assigned\n";
    } else {
        foreach ($roles as $role) {
            echo "  - " . $role->name . "\n";
        }
    }

    // Assign HR Manager role
    $role = Role::where('name', 'HR Manager')->first();
    if ($role) {
        $user->roles()->sync([$role->id]);
        echo "\n✓ HR Manager role assigned\n";
    }

    // Create token
    $tokens = $user->tokens();
    $tokens->delete(); // Delete old tokens

    $token = $user->createToken('hr-testing')->plainTextToken;
    echo "✓ Token created: " . $token . "\n";

    // Check permissions
    $permissions = $user->permissions;
    echo "\n✓ Assigned permissions: " . $permissions->count() . "\n";
    if ($permissions->count() > 0) {
        foreach ($permissions->take(5) as $perm) {
            echo "  - " . $perm->name . "\n";
        }
        if ($permissions->count() > 5) {
            echo "  ... and " . ($permissions->count() - 5) . " more\n";
        }
    }

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
