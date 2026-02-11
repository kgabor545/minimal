<?php
require __DIR__ . '/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];
$completed = $data['completed'];

/*
// szándékos hiba, teszteléshez:
if (true) {
    exit;
}
*/
$stmt = $pdo->prepare('UPDATE todos SET completed = ? WHERE id = ?');
$stmt->execute([$completed, $id]);

echo 'ok';
?>