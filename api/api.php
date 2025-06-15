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

if ($method === 'POST' && $path === '/api/api.php/add_ride') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (
        !isset($input['driver']) ||
        !in_array($input['driver'], ['Anne', 'Bram']) ||
        !isset($input['distance']) ||
        !is_numeric($input['distance']) ||
        !isset($input['date']) ||
        !preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $input['date'])
    ) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid input']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO v2_rides (driver, distance, date) VALUES (?, ?, ?)");
    $stmt->bind_param("sds", $input['driver'], $input['distance'], $input['date']);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Insert failed']);
    }
    exit;
}


http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
exit;
