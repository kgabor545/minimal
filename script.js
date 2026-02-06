const form = document.getElementById("todoform")
const input = document.getElementById("title")
const list = document.getElementById("todo-list")

/* ÚJ: oldalbetöltéskor taskok betöltése */
document.addEventListener("DOMContentLoaded", loadTodos)

form.addEventListener("submit", async (e) => {
  // DEBUG: csak a submit esemény jelzése
  console.log("submit")

  // megakadályozza az oldal újratöltését
  e.preventDefault()

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

    /* Új: módosítás gomb*/
    const text = document.createElement("span")
    const button = document.createElement("button")
    button.textContent = "modosítás"

    let editing = false

    button.addEventListener("click", async () => {
      if (!editing) {
        const input = document.createElement("input")
        input.type = "text"
        input.value = todo.title

        li.replaceChild(input, text)
        button.textContent = "mentés"
        input.focus()
        editing = true
      } else {
        const input = li.querySelector("input")
        const newTitle = input.value

        const response = await fetch("db-update.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: todo.id,
            title: newTitle,
          }),
        })

        loadTodos()
      }
    })
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

    li.appendChild(text)
    li.appendChild(button)
    li.appendChild(iconSpan)
    li.appendChild(titleSpan)
    list.appendChild(li)
  })
}

// GOOGLE KERESÉS – az ikon kivételével a szövegre kattintva indul
document.getElementById("todo-list").addEventListener("click", function (e) {
  // Ha az ikonra kattintott → ne induljon keresés (toggle már kezeli)
  if (e.target.textContent === "✔" || e.target.textContent === "✖") {
    return
  }

  // Megkeressük a todo címét a sorban
  const li = e.target.closest("li")
  if (!li) return

  // A második <span> általában a cím (az első az ikon)
  const titleSpan = li.querySelector("span:nth-child(2)")
  if (!titleSpan) return

  const todoSzoveg = titleSpan.textContent.trim()
  if (!todoSzoveg) return

  const kereses = encodeURIComponent(todoSzoveg)
  window.open(`https://www.google.com/search?q=${kereses}`, "_blank")
})
