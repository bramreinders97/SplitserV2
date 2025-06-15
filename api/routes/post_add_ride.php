<?php
$conn = include(__DIR__ . '/../db.php');
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
