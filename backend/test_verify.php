<?php
/**
 * Comprehensive verification test for all fixes.
 * Run: php test_verify.php
 */

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$base = 'http://127.0.0.1:8000/api';
$pass = 0;
$fail = 0;
$warn = 0;

function request(string $method, string $url, array $data = [], string $token = ''): array {
    $ch = curl_init($url);
    $headers = ['Accept: application/json', 'Content-Type: application/json'];
    if ($token) {
        $headers[] = "Authorization: Bearer $token";
    }
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'PUT') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'DELETE') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    }
    $response = curl_exec($ch);
    $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['status' => $status, 'body' => json_decode($response, true) ?? []];
}

function test(string $label, int $actual, int $expected, &$pass, &$fail): void {
    if ($actual === $expected) {
        echo "  ✅ PASS: $label (HTTP $actual)\n";
        $pass++;
    } else {
        echo "  ❌ FAIL: $label (expected $expected, got $actual)\n";
        $fail++;
    }
}

function login(string $email, string $password): string {
    global $base;
    $r = request('POST', "$base/auth/login", ['email' => $email, 'password' => $password]);
    return $r['body']['token'] ?? '';
}

// ═══════════════════════════════════════════════════
echo "\n=== FIX 1: Authentication Returns 401 (not 422) for bad credentials ===\n";
$r = request('POST', "$base/auth/login", ['email' => 'admin@macro.com', 'password' => 'wrongpassword']);
test('Invalid credentials → 401', $r['status'], 401, $pass, $fail);

$r = request('POST', "$base/auth/login", ['email' => 'bad@example.com', 'password' => 'anything']);
test('Non-existent user → 401', $r['status'], 401, $pass, $fail);

// ═══════════════════════════════════════════════════
echo "\n=== FIX 2: Workspace bypass for Super Admin (no department) ===\n";
$adminToken = login('admin@macro.com', 'password');
if (!$adminToken) { echo "  ⚠ Could not login as admin\n"; } else {
    $r = request('GET', "$base/workspace/dashboard", [], $adminToken);
    test('Admin workspace/dashboard (no department) → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/workspace/projects", [], $adminToken);
    test('Admin workspace/projects (no department) → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/workspace/team-members", [], $adminToken);
    test('Admin workspace/team-members (no department) → 200', $r['status'], 200, $pass, $fail);
}

// ═══════════════════════════════════════════════════
echo "\n=== FIX 3: Permission Assignments - Finance Manager ===\n";
$financeToken = login('finance@macro.com', 'password');
if (!$financeToken) { echo "  ⚠ Could not login as finance@macro.com\n"; } else {
    $r = request('GET', "$base/admin/finance/invoices", [], $financeToken);
    test('Finance Manager: GET /admin/finance/invoices → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/admin/finance/reports/profit-loss", [], $financeToken);
    test('Finance Manager: GET /admin/finance/reports/profit-loss → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/admin/users", [], $financeToken);
    test('Finance Manager: GET /admin/users → 403 (blocked)', $r['status'], 403, $pass, $fail);
}

// ═══════════════════════════════════════════════════
echo "\n=== FIX 3: Permission Assignments - HR Manager ===\n";
$hrToken = login('hr@macro.com', 'password');
if (!$hrToken) { echo "  ⚠ Could not login as hr@macro.com\n"; } else {
    $r = request('GET', "$base/admin/hr/employees", [], $hrToken);
    test('HR Manager: GET /admin/hr/employees → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/admin/hr/leaves", [], $hrToken);
    test('HR Manager: GET /admin/hr/leaves → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/admin/hr/performance-reviews", [], $hrToken);
    test('HR Manager: GET /admin/hr/performance-reviews → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/admin/finance/invoices", [], $hrToken);
    test('HR Manager: GET /admin/finance/invoices → 403 (blocked)', $r['status'], 403, $pass, $fail);
}

// ═══════════════════════════════════════════════════
echo "\n=== FIX 3: Permission Assignments - CRM Manager ===\n";
$crmToken = login('crm@macro.com', 'password');
if (!$crmToken) { echo "  ⚠ Could not login as crm@macro.com\n"; } else {
    $r = request('GET', "$base/admin/leads", [], $crmToken);
    test('CRM Manager: GET /admin/leads → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/admin/crm/dashboard", [], $crmToken);
    test('CRM Manager: GET /admin/crm/dashboard → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/admin/crm/clients", [], $crmToken);
    test('CRM Manager: GET /admin/crm/clients → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/admin/crm/deals", [], $crmToken);
    test('CRM Manager: GET /admin/crm/deals → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/admin/crm/proposals", [], $crmToken);
    test('CRM Manager: GET /admin/crm/proposals → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/admin/users", [], $crmToken);
    test('CRM Manager: GET /admin/users → 403 (blocked)', $r['status'], 403, $pass, $fail);
    $r = request('GET', "$base/admin/finance/invoices", [], $crmToken);
    test('CRM Manager: GET /admin/finance/invoices → 403 (blocked)', $r['status'], 403, $pass, $fail);
}

// ═══════════════════════════════════════════════════
echo "\n=== FIX 3: Permission Assignments - Content Manager ===\n";
$contentToken = login('content@macro.com', 'password');
if (!$contentToken) { echo "  ⚠ Could not login as content@macro.com\n"; } else {
    $r = request('GET', "$base/admin/blogs", [], $contentToken);
    test('Content Manager: GET /admin/blogs → 200', $r['status'], 200, $pass, $fail);
    // Create blog with correct status slug
    $r = request('POST', "$base/admin/blogs", [
        'title' => 'Test Blog by Content Mgr ' . time(),
        'excerpt' => 'Excerpt here',
        'content' => 'Blog content here for testing purposes.',
        'status' => 'draft',
        'author' => 'Content Manager',
    ], $contentToken);
    test('Content Manager: POST /admin/blogs → 201', $r['status'], 201, $pass, $fail);
    $r = request('GET', "$base/admin/faqs", [], $contentToken);
    test('Content Manager: GET /admin/faqs → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/admin/team", [], $contentToken);
    test('Content Manager: GET /admin/team → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/admin/finance/invoices", [], $contentToken);
    test('Content Manager: GET /admin/finance/invoices → 403 (blocked)', $r['status'], 403, $pass, $fail);
}

// ═══════════════════════════════════════════════════
echo "\n=== FIX 3: Permission Assignments - Accountant ===\n";
$acctToken = login('accountant@macro.com', 'password');
if (!$acctToken) { echo "  ⚠ Could not login as accountant@macro.com\n"; } else {
    $r = request('GET', "$base/admin/finance/invoices", [], $acctToken);
    test('Accountant: GET /admin/finance/invoices → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/admin/finance/reports/profit-loss", [], $acctToken);
    test('Accountant: GET /admin/finance/reports/profit-loss → 200', $r['status'], 200, $pass, $fail);
    $r = request('GET', "$base/admin/users", [], $acctToken);
    test('Accountant: GET /admin/users → 403 (blocked)', $r['status'], 403, $pass, $fail);
}

// ═══════════════════════════════════════════════════
echo "\n=== Blog/FAQ CRUD with correct status values (Super Admin) ===\n";
$adminToken2 = login('admin@macro.com', 'password');
if ($adminToken2) {
    $r = request('POST', "$base/admin/blogs", [
        'title'   => 'Admin Blog Test ' . time(),
        'excerpt' => 'Short excerpt',
        'content' => 'Full blog content here.',
        'status'  => 'draft',
        'author'  => 'Admin',
    ], $adminToken2);
    test('POST /admin/blogs with status=draft → 201', $r['status'], 201, $pass, $fail);

    $r = request('POST', "$base/admin/faqs", [
        'question' => 'Test FAQ Question?',
        'answer'   => 'Test FAQ Answer here.',
        'status'   => 'published',
    ], $adminToken2);
    test('POST /admin/faqs with status=published → 201', $r['status'], 201, $pass, $fail);
}

// ═══════════════════════════════════════════════════
echo "\n=== Viewer - Read-only access ===\n";
$viewerToken = login('viewer@macro.com', 'password');
if ($viewerToken) {
    $r = request('GET', "$base/admin/blogs", [], $viewerToken);
    test('Viewer: GET /admin/blogs → 200', $r['status'], 200, $pass, $fail);
    $r = request('POST', "$base/admin/blogs", ['title' => 'x', 'content' => 'y', 'status' => 'draft'], $viewerToken);
    test('Viewer: POST /admin/blogs → 403 (read-only)', $r['status'], 403, $pass, $fail);
}

// ═══════════════════════════════════════════════════
echo "\n=== Public endpoints (no auth) ===\n";
foreach ([
    '/public/services' => 200,
    '/public/blogs'    => 200,
    '/public/faqs'     => 200,
    '/public/team'     => 200,
] as $path => $expected) {
    $r = request('GET', "$base$path");
    test("GET $path → $expected", $r['status'], $expected, $pass, $fail);
}

// ═══════════════════════════════════════════════════
echo "\n=== Unauthenticated access to protected routes → 401 ===\n";
$r = request('GET', "$base/admin/users");
test('GET /admin/users (no token) → 401', $r['status'], 401, $pass, $fail);
$r = request('GET', "$base/workspace/dashboard");
test('GET /workspace/dashboard (no token) → 401', $r['status'], 401, $pass, $fail);

// ═══════════════════════════════════════════════════
echo "\n══════════════════════════════════════\n";
echo "  RESULTS: ✅ $pass PASS   ❌ $fail FAIL\n";
echo "══════════════════════════════════════\n\n";
