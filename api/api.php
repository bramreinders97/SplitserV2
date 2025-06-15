<?php
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($method === 'GET' && $path === '/api/api.php/all_rides') {
    require __DIR__ . '/routes/get_all_rides.php';
    exit;
}

if ($method === 'POST' && $path === '/api/api.php/add_ride') {
    require __DIR__ . '/routes/post_add_ride.php';
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);