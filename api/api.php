<?php
header('Content-Type: application/json');

$config = include(__DIR__ . '/.config.php');
$allowed_ips = $config['allowed_ips'] ?? [];

if (!in_array($_SERVER['REMOTE_ADDR'], $allowed_ips, true)) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

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

if ($method === 'GET' && $path === '/api/api.php/all_expenses') {
    require __DIR__ . '/routes/get_all_expenses.php';
    exit;
}

if ($method === 'POST' && $path === '/api/api.php/add_expense') {
    require __DIR__ . '/routes/post_add_expense.php';
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);