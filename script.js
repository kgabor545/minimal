const btn = document.getElementById("add")
const input = document.getElementById("title")
const list = document.getElementById("todo-list")

/* oldalbetöltéskor taskok betöltése */
document.addEventListener("DOMContentLoaded", loadTodos)

btn.addEventListener("click", async () => {
  const title = input.value.trim()
  if (!title) return

  await fetch("db-insert.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  })

  input.value = ""
  loadTodos()
})

/* taskok lekérése és kirajzolása */
async function loadTodos() {
  const response = await fetch("db-select.php")
  const todos = await response.json()

  list.innerHTML = ""

  todos.forEach((todo) => {
    const li = document.createElement("li")

    /* ===== KÉSZ / NINCS KÉSZ ===== */
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

    /* ===== CÍM + FONTOS FLAG ===== */
    const titleSpan = document.createElement("span")
    titleSpan.style.cursor = "pointer"

    const isImportant = Number(todo.important) === 1

    titleSpan.textContent = todo.title + (isImportant ? " (FONTOS)" : "")

    if (isImportant) {
      titleSpan.style.fontWeight = "bold"
      titleSpan.style.color = "darkred"
    }

    titleSpan.addEventListener("click", async () => {
      await fetch("important.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: todo.id,
          important: isImportant ? 0 : 1,
        }),
      })
      loadTodos()
    })

    /* ===== DOM ===== */
    li.appendChild(iconSpan)
    li.appendChild(titleSpan)
    list.appendChild(li)
  })
}
