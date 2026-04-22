<?php
$pdo = new PDO('mysql:host=127.0.0.1;dbname=macro_solutions', 'root', 'admin');
$stmt = $pdo->query('SELECT id, name, slug FROM departments WHERE slug IN ("human-resources", "engineering")');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));

$stmt = $pdo->query('SELECT id, name, code, primary_department_id FROM projects ORDER BY id DESC LIMIT 5');
echo "\n\nProjects:\n";
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
