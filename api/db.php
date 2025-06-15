<?php
$config = include(__DIR__ . '/.config.php');
$conn = new mysqli($config['host'], $config['user'], $config['pass'], $config['dbname']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}
return $conn;