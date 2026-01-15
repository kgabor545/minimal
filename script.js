const btn = document.getElementById('add');
const input = document.getElementById('title');
const list = document.getElementById('todo-list');

/* ÚJ: oldalbetöltéskor taskok betöltése */
document.addEventListener('DOMContentLoaded', loadTodos);

btn.addEventListener('click', async () => {
    const title = input.value;
    if (!title) return;

    await fetch('db-insert.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
    });

    input.value = '';

    /* ÚJ: mentés után frissítjük a listát */
    loadTodos();
});

/* ÚJ: taskok lekérése és kirajzolása */
async function loadTodos() {
    const response = await fetch('db-select.php');
    const todos = await response.json();

    list.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.title;
        list.appendChild(li);
    });
}
