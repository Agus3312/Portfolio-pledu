const STORAGE_KEY = 'todo-list-items';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const clearCompletedBtn = document.getElementById('clear-completed');

let tasks = loadTasks();

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { id: crypto.randomUUID(), text: 'Regar las plantas', completed: false },
      { id: crypto.randomUUID(), text: 'Hacer la compra', completed: true },
    ];
  } catch (error) {
    console.error('No se pudieron cargar las tareas:', error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = '';

  if (tasks.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'empty-state';
    emptyItem.textContent = 'No hay tareas todavía. ¡Agrega una!';
    list.appendChild(emptyItem);
    return;
  }

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `todo-item ${task.completed ? 'completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'todo-checkbox';
    checkbox.setAttribute('aria-label', `Marcar tarea como ${task.completed ? 'pendiente' : 'completada'}`);
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'todo-delete';
    deleteBtn.textContent = '×';
    deleteBtn.setAttribute('aria-label', `Eliminar tarea: ${task.text}`);
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    item.append(checkbox, text, deleteBtn);
    list.appendChild(item);
  });
}

function addTask(text) {
  const value = text.trim();

  if (!value) {
    input.focus();
    return;
  }

  tasks.unshift({
    id: crypto.randomUUID(),
    text: value,
    completed: false,
  });

  saveTasks();
  renderTasks();
  form.reset();
  input.focus();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask(input.value);
});

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
