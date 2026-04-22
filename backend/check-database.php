<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Role;

try {
    // List all roles
    $roles = Role::all();
    echo "Available roles:\n";
    foreach ($roles as $role) {
        echo "  - " . $role->name . "\n";
    }

    // Count users
    $userCount = User::count();
    echo "\nTotal users: " . $userCount . "\n";

    // List all users
    echo "\nExisting users:\n";
    $users = User::limit(5)->get();
    foreach ($users as $user) {
        echo "  - " . $user->email . " (" . $user->id . ")\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
