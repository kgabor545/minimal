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
    headers: { "Content-Type": "application/json" },
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

  // index a sorszámhoz
  todos.forEach((todo, index) => {
    const li = document.createElement("li")

    const isDone = Number(todo.completed) === 1
    const icon = isDone ? "✔" : "✖"

    const iconSpan = document.createElement("span")
    iconSpan.textContent = icon
    iconSpan.style.cursor = "pointer"

    /* Új: módosítás gomb*/
    const text = document.createElement("span")
    const button = document.createElement("button")
    button.textContent = "✏️"

    let editing = false

    button.addEventListener("click", async () => {
      if (!editing) {
        const input = document.createElement("input")
        input.type = "text"
        input.value = todo.title

        button.textContent = "💾"
        li.replaceChild(input, text)
        input.focus()
        editing = true
      } else {
        const input = li.querySelector("input")
        const newTitle = input.value

        await fetch("db-update.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: todo.id, title: newTitle }),
        })

        loadTodos()
      }
    })

    /* JAVÍTVA: toggle nem hív loadTodos()-t */
    /* Hiba esetén a pipa/x visszaváltozik*/
    iconSpan.addEventListener("click", async () => {
      const previousCompleted = Number(todo.completed)
      const newCompleted = previousCompleted === 1 ? 0 : 1

      todo.completed = newCompleted
      iconSpan.textContent = newCompleted === 1 ? "✔" : "✖"

      try {
        const response = await fetch("toggle.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: todo.id,
            completed: newCompleted,
          }),
        })

        // Hibakezelés
        if (!response.ok) {
          throw new Error("Szerver hiba")
        }

        const result = await response.text()

        if (result !== "ok") {
          throw new Error("Adatbázis hiba")
        }
      } catch (error) {
        // Visszaállítás az előzőre
        todo.completed = previousCompleted
        iconSpan.textContent = previousCompleted === 1 ? "✔" : "✖"

        alert("Nem sikerült frissíteni az adatbázist!")
      }
    })

    const titleSpan = document.createElement("span")
    titleSpan.textContent = todo.title

    // sorszám span hozzáadása
    const numberSpan = document.createElement("span")
    numberSpan.textContent = index + 1 + ". "
    numberSpan.style.marginRight = "6px"
    numberSpan.style.fontWeight = "bold"

    li.appendChild(numberSpan)
    li.appendChild(iconSpan)
    li.appendChild(titleSpan)
    li.appendChild(button)
    li.appendChild(text)
    list.appendChild(li)
  })
}

/* ÚJ: billentyűzetes 1–10 kijelölés */
document.addEventListener("keydown", (e) => {
  let index

  if (e.key === "0") {
    index = 9 // 0 = 10. elem
  } else if (e.key >= "1" && e.key <= "9") {
    index = Number(e.key) - 1
  } else {
    return // más gomb nem érdekel
  }

  const item = list.children[index]
  if (!item) return

  // korábbi kijelölés törlése
  document.querySelectorAll("#todo-list li").forEach((li) => li.classList.remove("selected"))

  // kiválasztott elem kiemelése
  item.classList.add("selected")
})
