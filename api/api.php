<?php
header('Content-Type: application/json');

$config = include(__DIR__ . '/.config.php');
$host = $config['host'];
$user = $config['user'];
$pass = $config['pass'];
$dbname = $config['dbname'];

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET' && $path === '/api/api.php/all_rides') {
    $result = $conn->query("SELECT * FROM v2_rides ORDER BY date DESC");
    if (!$result) {
        http_response_code(500);
        echo json_encode(['error' => 'Query failed']);
        exit;
    }

    $rides = [];
    while ($row = $result->fetch_assoc()) {
        $rides[] = $row;
    }

    echo json_encode($rides);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
exit;
