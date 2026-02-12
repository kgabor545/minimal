<?php
header("Content-Type: application/json");
require "db.php"; // vagy ahol a PDO kapcsolat van

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$important = $data["important"];

$stmt = $pdo->prepare("UPDATE todos SET important = ? WHERE id = ?");
$stmt->execute([$important, $id]);

echo json_encode(["success" => true]);
