<?php
// Allow CORS preflight from Docker dev (localhost)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(204);
    exit;
}

header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json');

$config = include(__DIR__ . '/.config.php');
$allowed_ips = $config['allowed_ips'] ?? [];

if (
    $_SERVER['REQUEST_METHOD'] !== 'OPTIONS' &&
    !in_array($_SERVER['REMOTE_ADDR'], $allowed_ips, true)
) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Route matches for new /api/* structure
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
