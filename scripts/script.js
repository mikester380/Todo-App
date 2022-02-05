'use strict';
const createTodo = document.querySelector('.create-todo');
const createTodoInput = document.querySelector('.create-todo__input');
const todoList = document.querySelector('.todos');
const filterContainers = document.querySelectorAll('.filters');
const clearCompletedButton = document.querySelector('.actions__clear-completed');
const itemLeft = document.querySelector('.actions__item-left-value');
const itemLeftText = document.querySelector('.actions__item-left-sop');

const theme = document.querySelector('.app-theme')
const themeSwitchButton = document.querySelector('.header__theme-switcher');
let currentTheme = theme.dataset.current;

const switchTheme = (e) => {
  if (currentTheme === 'light') {
    themeSwitchButton.classList.add('toggle-rotate')
    let icon = currentTheme === 'dark' ? 'moon': 'sun';
    themeSwitchButton.setAttribute('src', `images/icon-${icon}.svg`)
  } else {
    themeSwitchButton.classList.remove('toggle-rotate')
    let icon = currentTheme === 'dark' ? 'moon': 'sun';
    themeSwitchButton.setAttribute('src', `images/icon-${icon}.svg`)
  }
  currentTheme = currentTheme === 'dark' ? 'light': 'dark';
  theme.setAttribute('href', `stylesheets/${currentTheme}-theme.css`);
  localStorage.setItem('theme', currentTheme);
}
themeSwitchButton.addEventListener('click', switchTheme)

let intialTodos = [{
  text: 'Complete Todo App on Frontend Mentor',
  id: 1,
  completed: false
},
  {
    text: 'Pick up groceries',
    id: 2,
    completed: false
  },
  {
    text: 'Read for 1 hour',
    id: 3,
    completed: false
  },
  {
    text: '10 minutes meditation',
    id: 4,
    completed: false
  },
  {
    text: 'Jog around the park 3x',
    id: 5,
    completed: false
  },
  {
    text: 'Complete online javascript course',
    id: 6,
    completed: false
  }];
let todos = [];
const Todo = function (text, id) {
  this.text = text;
  this.id = id;
  this.completed = false;
}

const addTodo = (todo) => {
  const todoElement = `
  <div class="todo" id="todo${todo.id}">
  <div class="todo__check check ${todo.completed ? 'todo--checked': ''}" data-id="${todo.id}">
  <img src="images/icon-check.svg" alt="" class="todo__icon-check check ${todo.completed ? '': 'hidden'}" data-id="${todo.id}">
  </div>
  <p class="todo__text ${todo.completed ? 'todo--crossed': ''}">${todo.text}</p>
  <img src="images/icon-cross.svg" alt="delete todo" class="todo__delete" data-id="${todo.id}">
  </div>
  `
  todoList.insertAdjacentHTML('afterbegin', todoElement);
  updateCount();
}

const updateLocalStorage = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
}

const updateCount = () => {
  let uncompleted = todos.filter(todo => todo.completed === false).length;
  let counterText = uncompleted > 1 ? 'items': 'item';
  itemLeft.textContent = uncompleted;
  itemLeftText.textContent = counterText;
}

const markCompleted = (todoId) => {
  let [todo] = todos.filter(t => t.id === todoId);
  let todoElem = document.querySelector(`#todo${todoId}`);
  let check = todoElem.querySelector('.todo__check');
  let iconCheck = todoElem.querySelector('.todo__icon-check')
  let text = todoElem.querySelector('.todo__text')
  if (!todo.completed) {
    check.classList.add('todo--checked');
    iconCheck.classList.remove('hidden')
    text.classList.add('todo--crossed');
    todo.completed = true;
    updateCount();
    updateLocalStorage()
    refreshFilter('active')
  } else {
    check.classList.remove('todo--checked');
    iconCheck.classList.add('hidden')
    text.classList.remove('todo--crossed');
    todo.completed = false;
    updateCount();
    updateLocalStorage()
    refreshFilter('completed')
  };
}

const deleteTodo = (todoId) => {
  let todoElem = document.querySelector(`#todo${todoId}`);
  todos = todos.filter(todo => todo.id !== todoId);
  todoElem.classList.add('todo--fall-out')
  const deleteElem = setTimeout(() => {
    todoElem.remove();
    clearTimeout(deleteElem);
  }, 300)
  updateLocalStorage()
  updateCount();
}

const filterTodo = (type) => {
  if (type === 'active') {
    let results = todos.filter(todo => todo.completed === false);
    todoList.innerHTML = "";
    results.forEach(result => addTodo(result));
  } else if (type === 'completed') {
    let results = todos.filter(todo => todo.completed === true);
    todoList.innerHTML = "";
    results.forEach(result => addTodo(result));
  } else {
    todoList.innerHTML = "";
    todos.forEach(todo => addTodo(todo));
  }
}

const refreshFilter = (type) => {
  document.querySelectorAll('.filter').forEach(filter => {
    if (filter.classList.contains(`filter--active`) && filter.dataset.type === type) {
      filterTodo(type);
    }
  });
}

const clearCompleted = () => {
  todos = todos.filter(todo => todo.completed !== true);
  todoList.innerHTML = "";
  todos.forEach(todo => addTodo(todo));
  updateCount();
  updateLocalStorage();
  refreshFilter('completed')
}

createTodo.addEventListener('submit', (e) => {
  e.preventDefault();
  let todoIds = todos.map(todo => todo.id);
  let todoId = todoIds.length === 0 ? 1: Math.max(...todoIds) + 1;
  let todo = new Todo(createTodoInput.value, todoId)
  todos.push(todo);
  addTodo(todo);
  updateLocalStorage()
  createTodoInput.value = "";
});

todoList.addEventListener('click', (e) => {
  let clicked = e.target;
  if (clicked !== e.currentTarget) {
    if (clicked.classList.contains('check')) markCompleted(+clicked.dataset.id);
    if (clicked.classList.contains('todo__delete')) deleteTodo(+clicked.dataset.id);
  }
});

filterContainers.forEach(filterContainer => filterContainer.addEventListener('click', (e) => {
  let clicked = e.target;
  if (clicked !== e.currentTarget) {
    filterTodo(clicked.dataset.type);
    document.querySelectorAll('.filter').forEach(filter => filter.classList.remove('filter--active'));
    clicked.classList.add('filter--active');
  }
}));

clearCompletedButton.addEventListener('click', clearCompleted);

if (!localStorage.getItem('visited')) {
  todos = intialTodos;
  todos.forEach(todo => addTodo(todo));
  localStorage.setItem('visited', true)
  localStorage.setItem('todos', JSON.stringify(todos))
} else if (localStorage.getItem('visited')) {
  if (localStorage.getItem('todos')) {
    todos = JSON.parse(localStorage.getItem('todos'))
    todos.forEach(todo => addTodo(todo));
  }
}

if (localStorage.getItem('theme')) {
  let savedTheme = localStorage.getItem('theme');
  theme.setAttribute('href', `stylesheets/${savedTheme}-theme.css`);
  theme.dataset.current = savedTheme;
  currentTheme = theme.dataset.current;
}