<?php
$conn = include(__DIR__ . '/../db.php');
$result = $conn->query("SELECT * FROM v2_expenses ORDER BY id");
if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed']);
    exit;
}
$expenses = [];
while ($row = $result->fetch_assoc()) {
    $expenses[] = $row;
}
echo json_encode($expenses);
