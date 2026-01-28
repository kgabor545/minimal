<?php
header('Content-Type: application/json; charset=utf-8');

require 'db.php'; // ugyanazt a kapcsolatot használjuk

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Hiányzó id"
    ]);
    exit;
}

$id = (int)$data['id'];

$stmt = $pdo->prepare("DELETE FROM todos WHERE id = ?");
$stmt->execute([$id]);

echo json_encode([
    "success" => true,
    "deleted_id" => $id
]);
