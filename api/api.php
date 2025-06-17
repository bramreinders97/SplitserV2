<?php
require __DIR__ . '/cors_guard.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($method === 'GET' && $path === '/api/all_rides') {
    require __DIR__ . '/routes/get_all_rides.php';
    exit;
}

if ($method === 'POST' && $path === '/api/add_ride') {
    require __DIR__ . '/routes/post_add_ride.php';
    exit;
}

if ($method === 'GET' && $path === '/api/all_expenses') {
    require __DIR__ . '/routes/get_all_expenses.php';
    exit;
}

if ($method === 'POST' && $path === '/api/add_expense') {
    require __DIR__ . '/routes/post_add_expense.php';
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
