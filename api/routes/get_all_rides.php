<?php
$conn = include(__DIR__ . '/../db.php');
$result = $conn->query("SELECT * FROM v2_rides ORDER BY id");
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
