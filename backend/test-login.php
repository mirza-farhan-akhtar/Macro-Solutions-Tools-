<?php

// Test login and API access
$curl = curl_init();

// Step 1: Login
curl_setopt_array($curl, array(
  CURLOPT_URL => 'http://127.0.0.1:8000/api/auth/login',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => json_encode(['email' => 'admin@macro.com', 'password' => 'password']),
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/json',
    'Accept: application/json'
  ),
));

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

echo "=== LOGIN RESPONSE ===\n";
echo "HTTP " . $httpCode . "\n";
$loginData = json_decode($response, true);
print_r($loginData);

if (isset($loginData['data']['token'])) {
    $token = $loginData['data']['token'];
    echo "\n✅ Got token: " . substr($token, 0, 20) . "...\n";
    
    // Step 2: Call CRM Dashboard API with token
    curl_setopt($curl, CURLOPT_URL, 'http://127.0.0.1:8000/api/admin/crm/dashboard');
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
    curl_setopt($curl, CURLOPT_POSTFIELDS, '');
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . $token
    ));
    
    $dashboardResponse = curl_exec($curl);
    $dashboardHttpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    
    echo "\n=== DASHBOARD RESPONSE ===\n";
    echo "HTTP " . $dashboardHttpCode . "\n";
    $dashboardData = json_decode($dashboardResponse, true);
    
    if ($dashboardHttpCode === 200) {
        echo "✅ Dashboard API working!\n";
        if (isset($dashboardData['data'])) {
            echo "\nMetrics:\n";
            foreach ($dashboardData['data'] as $key => $value) {
                if (is_array($value)) {
                    echo "  $key: [array with " . count($value) . " items]\n";
                } else {
                    echo "  $key: $value\n";
                }
            }
        }
    } else {
        echo "❌ Error\n";
        print_r($dashboardData);
    }
} else {
    echo "\n❌ Login failed\n";
}

curl_close($curl);
?>
