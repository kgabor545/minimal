<?php
require 'db.php'; // PDO kapcsolat

$stmt = $pdo->query("SELECT id, title, completed, important FROM todos ORDER BY id DESC");
$todos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($todos);
