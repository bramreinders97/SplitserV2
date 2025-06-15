<?php
$conn = include(__DIR__ . '/../db.php');
$input = json_decode(file_get_contents('php://input'), true);

if (
    !isset($input['payer']) ||
    !in_array($input['payer'], ['Anne', 'Bram']) ||
    !isset($input['amount']) ||
    !is_numeric($input['amount']) ||
    !isset($input['date']) ||
    !preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $input['date'])
) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$description = $input['description'] ?? null;

$stmt = $conn->prepare("INSERT INTO v2_expenses (amount, payer, description, date) VALUES (?, ?, ?, ?)");
$stmt->bind_param("dsss", $input['amount'], $input['payer'], $description, $input['date']);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Insert failed']);
}
