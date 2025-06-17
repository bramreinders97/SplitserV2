<?php
header('Content-Type: application/json');

$config = include(__DIR__ . '/.config.php');
$allowed_ips = $config['allowed_ips'] ?? [];
$allowed_origins = $config['allowed_origins'] ?? [];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';

if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$hostMatches = false;
foreach ($allowed_origins as $o) {
    if (str_contains($origin, $o) || str_contains($referer, $o)) {
        $hostMatches = true;
        break;
    }
}

if (
    !in_array($_SERVER['REMOTE_ADDR'], $allowed_ips, true) &&
    !$hostMatches
) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}
