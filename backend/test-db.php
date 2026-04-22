<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$db = $app->make('db');

try {
    echo "Testing database connection...\n";
    $connection = $db->connection()->getPDO();
    echo "✓ Database connection successful!\n";
    
    // Try a simple query
    $result = $db->select("SELECT 1 as test");
    echo "✓ Query execution successful!\n";
    
} catch (\Exception $e) {
    echo "✗ Connection failed: " . $e->getMessage() . "\n";
    exit(1);
}
