<?php
require __DIR__ . '/db.php'; // includes your $pdo connection

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'] ?? null;
$title = $data['title'] ?? null;

if (!$id || !$title) {
    echo "Missing id or title";
    exit;
}

$sql = "UPDATE todos SET title = :title WHERE id = :id";
$stmt = $pdo->prepare($sql);

if ($stmt->execute([':title' => $title, ':id' => $id])) {
    echo "Success";
} else {
    echo "Failed";
}
?>
