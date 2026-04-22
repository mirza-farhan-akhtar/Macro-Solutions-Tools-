<?php
$env = getenv('DB_CONNECTION');
$host = getenv('DB_HOST');
$user = getenv('DB_USERNAME');
$pass = getenv('DB_PASSWORD');
$db = getenv('DB_DATABASE');

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("DESCRIBE departments");
echo "\n=== DEPARTMENTS TABLE STRUCTURE ===\n\n";
printf("%-20s %-25s %-10s\n", "COLUMN", "TYPE", "NULL");
echo str_repeat("-", 55) . "\n";
while ($row = $result->fetch_assoc()) {
    printf("%-20s %-25s %-10s\n", $row['Field'], $row['Type'], $row['Null']);
}
echo "\n";

$conn->close();
?>
