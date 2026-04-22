<?php

// Test CRM endpoints after fix
$token = 'placeholder'; // Will be set below

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

// Test endpoints
$endpoints = [
    '/admin/crm/leads',
    '/admin/crm/clients',
    '/admin/crm/deals',
    '/admin/crm/proposals',
    '/admin/crm/activities',
];

echo "=== TESTING CRM ENDPOINTS ===\n";

foreach ($endpoints as $endpoint) {
    curl_setopt($curl, CURLOPT_URL, 'http://127.0.0.1:8000/api' . $endpoint);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
    curl_setopt($curl, CURLOPT_POSTFIELDS, '');
    curl_setopt($curl, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $data = json_decode($response, true);
    
    $status = ($httpCode === 200) ? '✅' : '❌';
    $count = ($httpCode === 200 && isset($data['data'])) ? count($data['data']) : 0;
    
    echo "$status $endpoint - HTTP $httpCode";
    if ($httpCode === 200 && isset($data['data'])) {
        echo " ($count items)";
    }
    echo "\n";
}

echo "\n=== ALL TESTS COMPLETE ===\n";
?>
