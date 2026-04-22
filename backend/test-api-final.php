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

echo "=== LOGIN TEST ===\n";
echo "HTTP $httpCode";
$loginData = json_decode($response, true);

if ($httpCode === 200 && isset($loginData['token'])) {
    $token = $loginData['token'];
    echo " ✅\n";
    echo "User: " . $loginData['user']['email'] . "\n\n";
    
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
    
    echo "=== DASHBOARD API TEST ===\n";
    echo "HTTP $dashboardHttpCode";
    $dashboardData = json_decode($dashboardResponse, true);
    
    if ($dashboardHttpCode === 200) {
        echo " ✅\n";
        echo "\nDashboard Data Keys:\n";
        if (isset($dashboardData['data'])) {
            foreach ($dashboardData['data'] as $key => $value) {
                if (is_array($value)) {
                    if (count($value) > 0 && isset($value[0])) {
                        echo "- $key: " . count($value) . " items\n";
                    } else {
                        echo "- $key: (empty)\n";
                    }
                } else {
                    echo "- $key: $value\n";
                }
            }
        }
    } else {
        echo " ❌\n";
        if (isset($dashboardData['message'])) {
            echo "Error: " . $dashboardData['message'] . "\n";
        } else {
            echo "Full response:\n" . print_r($dashboardData, true) . "\n";
        }
    }
} else {
    echo " ❌\n";
    echo "Login failed or unexpected response\n";
    echo "Response: " . print_r($loginData, true) . "\n";
}
?>
