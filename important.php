<?php
require __DIR__ . '/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];
$important = $data['important'];

$stmt = $pdo->prepare('UPDATE todos SET important = ? WHERE id = ?');
$stmt->execute([$important, $id]);

echo 'ok';
