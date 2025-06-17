<?php
$conn = include(__DIR__ . '/../db.php');
$input = json_decode(file_get_contents('php://input'), true);

if (
    !isset($input['driver']) ||
    !in_array($input['driver'], ['Anne', 'Bram']) ||
    !isset($input['distance']) ||
    !is_numeric($input['distance']) ||
    !isset($input['date']) ||
    !preg_match('/^\d{4}-\d{2}-\d{2}$/', $input['date']) // Date only, no time
) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$description = isset($input['description']) ? $input['description'] : null;

$stmt = $conn->prepare("INSERT INTO v2_rides (driver, distance, date, description) VALUES (?, ?, ?, ?)");
$stmt->bind_param("sdss", $input['driver'], $input['distance'], $input['date'], $description);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Insert failed']);
}
