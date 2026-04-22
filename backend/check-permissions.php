<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/bootstrap/app.php';

use App\Models\Permission;
use App\Models\User;

// Check CRM permissions
$crmPermissions = Permission::where('module', 'like', '%crm%')
    ->orWhere('slug', 'like', '%crm%')
    ->get();

echo "=== CRM PERMISSIONS ===\n";
if ($crmPermissions->count() > 0) {
    echo "✅ Found " . $crmPermissions->count() . " CRM permissions:\n";
    foreach ($crmPermissions as $perm) {
        echo "  - " . $perm->slug . " (" . $perm->name . ")\n";
    }
} else {
    echo "❌ NO CRM PERMISSIONS FOUND\n";
}

// Check admin user has CRM permissions
$admin = User::where('email', 'admin@macro.com')->first();
if ($admin) {
    echo "\n=== ADMIN USER (admin@macro.com) ===\n";
    echo "User ID: " . $admin->id . "\n";
    echo "Roles: " . implode(', ', $admin->roles->pluck('slug')->toArray()) . "\n";
    echo "Super Admin: " . ($admin->isSuperAdmin() ? 'YES' : 'NO') . "\n";
    
    // Check specific CRM permissions
    $hasCRMDashboard = $admin->hasAnyPermission(['crm.dashboard']);
    echo "Has crm.dashboard permission: " . ($hasCRMDashboard ? 'YES' : 'NO') . "\n";
}
?>
