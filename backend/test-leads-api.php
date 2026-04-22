<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/bootstrap/app.php';

use App\Models\User;

// Get admin token
$admin = User::where('email', 'admin@macro.com')->first();
$token = $admin->createToken('Test')->plainTextToken;

// Test Leads API
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => 'http://127.0.0.1:8000/api/admin/crm/leads',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json'
    ],
]);

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$data = json_decode($response, true);

echo "=== LEADS API TEST ===\n";
echo "HTTP: $httpCode\n";
if ($httpCode === 200) {
    echo "✅ Response OK\n";
    echo "Items: " . count($data['data']) . "\n";
    if (isset($data['pagination'])) {
        echo "Total: " . $data['pagination']['total'] . "\n";
    }
} else {
    echo "❌ Error\n";
    echo json_encode($data, JSON_PRETTY_PRINT) . "\n";
}
?>
