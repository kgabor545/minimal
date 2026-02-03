const btn = document.getElementById("add")
const input = document.getElementById("title")
const list = document.getElementById("todo-list")

/* ÚJ: oldalbetöltéskor taskok betöltése */
document.addEventListener("DOMContentLoaded", loadTodos)

btn.addEventListener("click", async () => {
  const title = input.value
  if (!title) return

  await fetch("db-insert.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  })

  input.value = ""

  /* ÚJ: mentés után frissítjük a listát */
  loadTodos()
})

/* ÚJ: taskok lekérése és kirajzolása */
async function loadTodos() {
  const response = await fetch("db-select.php")
  const todos = await response.json()

  list.innerHTML = ""

  todos.forEach((todo) => {
    const li = document.createElement("li")

    const isDone = Number(todo.completed) === 1
    const icon = isDone ? "✔" : "✖"

    const iconSpan = document.createElement("span")
    iconSpan.textContent = icon
    iconSpan.style.cursor = "pointer"

    iconSpan.addEventListener("click", async () => {
      await fetch("toggle.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: todo.id,
          completed: isDone ? 0 : 1,
        }),
      })
      loadTodos()
    })

    const titleSpan = document.createElement("span")
    titleSpan.textContent = todo.title

    const delBtn = document.createElement("button")
    delBtn.textContent = "🗑"
    delBtn.style.marginLeft = "10px"

    delBtn.addEventListener("click", async () => {
      li.remove()

      await fetch("db-delete.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: todo.id }),
      })
    })

    li.appendChild(iconSpan)
    li.appendChild(titleSpan)
    li.appendChild(delBtn)
    list.appendChild(li)
  })
}

