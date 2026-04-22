<?php

// Test Pipeline endpoint
$token = 'placeholder';

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => 'http://127.0.0.1:8000/api/auth/login',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => json_encode(['email' => 'admin@macro.com', 'password' => 'password']),
]);

$response = json_decode(curl_exec($curl), true);
$token = $response['token'];

curl_setopt($curl, CURLOPT_URL, 'http://127.0.0.1:8000/api/admin/crm/deals/pipeline');
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
curl_setopt($curl, CURLOPT_POSTFIELDS, '');
curl_setopt($curl, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json'
]);

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$data = json_decode($response, true);

echo "HTTP: $httpCode\n";
echo json_encode($data, JSON_PRETTY_PRINT) . "\n";
?>
