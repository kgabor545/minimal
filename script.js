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

    const isDone = Number(todo.completed) === 1;
    const icon = isDone ? '✔' : '✖';
    
    li.textContent = `${icon} ${todo.title}`;
    /* Új: módosítás gomb*/ 
    const text = document.createElement('span');

    const button = document.createElement('button');
    button.textContent = 'modosítás';
    
    let editing = false;

    button.addEventListener('click', async () => {
        if (!editing) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = todo.title;

            li.replaceChild(input, text);
            button.textContent = 'mentés';
            input.focus();
            editing = true;
        } else {
            const input = li.querySelector('input');
            const newTitle = input.value;

            const response = await fetch('db-update.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: todo.id,
                    title: newTitle
                })
            });

            const result = await response.text();
            console.log(result);

            loadTodos();
        }
    });

    li.appendChild(text);
    li.appendChild(button);
    list.appendChild(li);
});

}

 