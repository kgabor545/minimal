<?php
header('Content-Type: application/json; charset=utf-8');

require 'db.php';

$dataRaw = file_get_contents("php://input");
$data = json_decode($dataRaw, true) ?? [];

$id = isset($data['id']) ? (int)$data['id'] : 0;

$stmt = $pdo->prepare("DELETE FROM todos WHERE id = ?");
$stmt->execute([$id]);

echo json_encode([
  "success" => true,
  "deleted_id" => $id
]);
