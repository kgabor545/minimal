<?php
require "db.php";

$pdo->exec("ALTER TABLE todos ADD COLUMN important TINYINT(1) DEFAULT 0");

echo json_encode(["success" => true, "message" => "Az 'important' oszlop létrejött."]);
