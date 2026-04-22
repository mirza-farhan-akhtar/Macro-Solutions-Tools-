<?php

// Test full CRM endpoints with response structure
$token = 'placeholder';

// Login first
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => 'http://127.0.0.1:8000/api/auth/login',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: application/json'],
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => json_encode(['email' => 'admin@macro.com', 'password' => 'password']),
]);

$response = curl_exec($curl);
$loginData = json_decode($response, true);
$token = $loginData['token'] ?? null;

if (!$token) {
    echo "❌ Login failed\n";
    exit(1);
}

echo "✅ Logged in\n\n";

// Test leads endpoint with details
curl_setopt($curl, CURLOPT_URL, 'http://127.0.0.1:8000/api/admin/crm/leads?search=');
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
curl_setopt($curl, CURLOPT_POSTFIELDS, '');
curl_setopt($curl, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json'
]);

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$data = json_decode($response, true);

echo "=== LEADS API RESPONSE ===\n";
echo "HTTP: $httpCode\n\n";

echo "Response Structure:\n";
echo "- success: " . ($data['success'] ?? 'N/A') . "\n";
echo "- data type: " . gettype($data['data']) . "\n";

if (is_array($data['data'])) {
    echo "- data count: " . count($data['data']) . "\n";
    if (count($data['data']) > 0) {
        echo "- first item keys: " . implode(', ', array_keys($data['data'][0])) . "\n";
    }
}

echo "\n- pagination: " . (isset($data['pagination']) ? 'YES' : 'NO') . "\n";
if (isset($data['pagination'])) {
    echo "  - total: " . $data['pagination']['total'] . "\n";
    echo "  - per_page: " . $data['pagination']['per_page'] . "\n";
    echo "  - current_page: " . $data['pagination']['current_page'] . "\n";
}

echo "\n=== FULL RESPONSE ===\n";
echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
?>
