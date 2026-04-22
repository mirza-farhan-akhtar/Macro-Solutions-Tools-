<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/bootstrap/app.php';

use App\Models\User;
use App\Models\Lead;
use Illuminate\Support\Facades\Route;

// Get first user and create token
$user = User::first();
if (!$user) {
    echo "❌ No users found in database\n";
    exit(1);
}

echo "👤 User: " . $user->email . "\n";
echo "🔐 User ID: " . $user->id . "\n";
echo "👥 Is Super Admin: " . ($user->isSuperAdmin() ? 'YES' : 'NO') . "\n\n";

// Create token
$token = $user->createToken('TestToken')->plainTextToken;
echo "🔑 Token: " . substr($token, 0, 20) . "...\n\n";

// Check test data
echo "=== TEST DATA COUNT ===\n";
echo "Leads: " . Lead::count() . "\n";
echo "Clients: " . count(\App\Models\Client::all()) . "\n";
echo "Deals: " . count(\App\Models\Deal::all()) . "\n";
echo "Proposals: " . count(\App\Models\Proposal::all()) . "\n";
echo "Activities: " . count(\App\Models\Activity::all()) . "\n\n";

// Check routes
echo "=== CHECKING ROUTES ===\n";
$routes = Route::getRoutes();
$crmRoutes = [];
foreach ($routes as $route) {
    if (strpos($route->uri, 'api/admin/crm') !== false) {
        $crmRoutes[] = strtoupper($route->methods[0]) . ' /' . $route->uri;
    }
}

if (count($crmRoutes) > 0) {
    echo "✅ Found " . count($crmRoutes) . " CRM routes:\n";
    foreach (array_slice($crmRoutes, 0, 10) as $route) {
        echo "  - " . $route . "\n";
    }
    if (count($crmRoutes) > 10) {
        echo "  ... and " . (count($crmRoutes) - 10) . " more\n";
    }
} else {
    echo "❌ NO CRM ROUTES FOUND IN api.php!\n";
    echo "   Check if routes/crm.php is included in routes/api.php\n";
}

echo "\n✅ Test completed!\n";
?>
