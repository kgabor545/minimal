<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <title>Todo</title>
    <script src="script.js" defer></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="add-box">
<form id="todoform">
    <input type="text" id="title" placeholder="Új todo">
    <button id="add" type="submit">Hozzáadás</button>
</form>
</div> 
<br>
<label>
    <input type="checkbox" id="hide-done">
    Kész feladatok elrejtése
</label>

<div class="list">
    <ul id="todo-list"></ul>
</div>

</body>
</html>
