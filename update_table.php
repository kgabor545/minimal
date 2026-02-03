<?php
require __DIR__ . '/db.php';

try {
    // meglévő oszlopok lekérése
    $columns = $pdo->query("SHOW COLUMNS FROM todos")->fetchAll(PDO::FETCH_ASSOC);
    $columnNames = array_column($columns, 'Field');

    // completed oszlop
    if (!in_array('completed', $columnNames)) {
        $pdo->exec("ALTER TABLE todos ADD completed TINYINT(1) NOT NULL DEFAULT 0");
        echo "<p>➕ 'completed' oszlop hozzáadva</p>";
    } else {
        $pdo->exec("ALTER TABLE todos MODIFY completed TINYINT(1) NOT NULL DEFAULT 0");
        echo "<p>✔ 'completed' oszlop frissítve</p>";
    }

    // important oszlop
    if (!in_array('important', $columnNames)) {
        $pdo->exec("ALTER TABLE todos ADD important TINYINT(1) NOT NULL DEFAULT 0");
        echo "<p>➕ 'important' oszlop hozzáadva</p>";
    } else {
        $pdo->exec("ALTER TABLE todos MODIFY important TINYINT(1) NOT NULL DEFAULT 0");
        echo "<p>✔ 'important' oszlop frissítve</p>";
    }

    echo "<h2>✅ Tábla frissítés kész.</h2>";

} catch (PDOException $e) {
    echo "<h2>❌ Hiba történt:</h2>";
    echo "<pre>" . $e->getMessage() . "</pre>";
}
