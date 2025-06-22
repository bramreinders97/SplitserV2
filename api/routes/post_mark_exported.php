<?php
$conn = include(__DIR__ . '/../db.php');
header('Content-Type: application/json');

$updateRides = $conn->prepare("UPDATE v2_rides SET exported = TRUE WHERE exported = FALSE");
$updateExpenses = $conn->prepare("UPDATE v2_expenses SET exported = TRUE WHERE exported = FALSE");

$ridesSuccess = $updateRides->execute();
$expensesSuccess = $updateExpenses->execute();

if ($ridesSuccess && $expensesSuccess) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    $errors = [];
    if (!$ridesSuccess) {
        $errors[] = 'v2_rides update failed';
    }
    if (!$expensesSuccess) {
        $errors[] = 'v2_expenses update failed';
    }
    echo json_encode(['error' => implode('; ', $errors)]);
}
