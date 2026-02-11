const form = document.getElementById("todoform")
const input = document.getElementById("title")
const list = document.getElementById("todo-list")

document.addEventListener("DOMContentLoaded", loadTodos)

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const title = input.value.trim()
  if (!title) return

  await fetch("db-insert.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  })

  input.value = ""
  loadTodos()
})

async function loadTodos() {
  const response = await fetch("db-select.php")
  const todos = await response.json()

  list.innerHTML = ""

  todos.forEach((todo, index) => {
    const li = document.createElement("li")

    const isDone = Number(todo.completed) === 1
    const icon = isDone ? "✔" : "✖"

    /* ===== ÁLLAPOT IKON ===== */
    const iconSpan = document.createElement("span")
    iconSpan.textContent = icon
    iconSpan.style.cursor = "pointer"

    iconSpan.addEventListener("click", async () => {
      await fetch("toggle.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: todo.id, completed: isDone ? 0 : 1 }),
      })
      loadTodos()
    })

    /* ===== SORSZÁM ===== */
    const numberSpan = document.createElement("span")
    numberSpan.textContent = index + 1 + ". "
    numberSpan.style.marginRight = "6px"
    numberSpan.style.fontWeight = "bold"

    /* ===== CÍM ===== */
    const titleSpan = document.createElement("span")
    titleSpan.textContent = todo.title
    titleSpan.style.marginRight = "10px"

    /* ===== SZERKESZTÉS GOMB ===== */
    const editButton = document.createElement("button")
    editButton.textContent = "✏️"

    let editing = false

    editButton.addEventListener("click", async () => {
      if (!editing) {
        const editInput = document.createElement("input")
        editInput.type = "text"
        editInput.value = todo.title

        editButton.textContent = "💾"
        li.replaceChild(editInput, titleSpan)
        editInput.focus()
        editing = true
      } else {
        const editInput = li.querySelector("input")
        const newTitle = editInput.value.trim()

        if (newTitle && newTitle !== todo.title) {
          await fetch("db-update.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: todo.id, title: newTitle }),
          })
        }

        loadTodos()
      }
    })

    /* ===== 🔎 KERESŐ GOMB ===== */
    const searchButton = document.createElement("button")
    searchButton.textContent = "🔎"

    searchButton.addEventListener("click", () => {
      const todoTitle = todo.title.trim()
      if (!todoTitle) return

      const searchText = encodeURIComponent(todoTitle)
      window.open(`https://www.google.com/search?q=${searchText}`, "_blank")
    })

    /* ===== ELEMEK HOZZÁADÁSA ===== */
    li.appendChild(numberSpan)
    li.appendChild(iconSpan)
    li.appendChild(titleSpan)
    li.appendChild(editButton)
    li.appendChild(searchButton)

    list.appendChild(li)
  })
}

/* billentyűzetes 1–10 kijelölés */
document.addEventListener("keydown", (e) => {
  let index

  if (e.key === "0") {
    index = 9
  } else if (e.key >= "1" && e.key <= "9") {
    index = Number(e.key) - 1
  } else {
    return
  }

  const item = list.children[index]
  if (!item) return

  document.querySelectorAll("#todo-list li").forEach((li) => li.classList.remove("selected"))

  item.classList.add("selected")
})
