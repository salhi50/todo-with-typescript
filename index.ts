// Dom elements
const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const addBtn = document.getElementById("add-btn") as HTMLButtonElement;
const todosMenu = document.getElementById("todos-menu") as HTMLElement;

// Interfaces
interface Todo {
  id: number;
  isCompleted: boolean;
  title: string;
}
interface HTMLAttributes {
  type: string;
  className?: string;
  callbackOnClick?: (event: MouseEvent) => any;
  children?: string | HTMLElement | HTMLElement[];
}

// Variables
let newTodo: string = "";
let todos: Todo[] = JSON.parse(localStorage.getItem("todos") || "[]");

// Start methods

function updateTodos(): void {
  todosMenu.innerHTML = "";
  todos.forEach((todo: Todo) => {
    todosMenu.appendChild(createTodoElement(todo));
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo(title: Todo["title"]): void | undefined {
  let todosTitles: string[] = todos.map(todo => todo.title);
  if(isEmpty(title) || isAlreadyExist(todosTitles, title))
    return;
  todos.push({
    id: new Date().getTime(),
    title: title,
    isCompleted: false
  });
  updateTodos();
  resetNewTodo();
}

function isEmpty(value: string): boolean {
  return value.length === 0 || /^[\s]+$/.test(value);
}

function isAlreadyExist(arr: string[], value: string): boolean {
  return (
    arr
    .map(v => v.toLowerCase())
    .indexOf(value.toLowerCase()) !== -1
  );
}

function resetNewTodo(): void {
  newTodo = "";
  todoInput.value = "";
  todoInput.focus();
}

function createTodoElement(todo: Todo) {

  const titleEl = <HTMLParagraphElement>createElement({
    type: "p",
    className: "fs-3 m-0",
    children: todo.title
  });

  const todoBadge: HTMLElement = createElement({
    type: 'span',
    className: `badge bg-${todo.isCompleted ? "success" : "warning"}-subtle text-black`,
    children: todo.isCompleted ? "Completed" : "Pending"
  });

  const completeBtn = <HTMLButtonElement>createElement({
    type: "button",
    className: "btn text-primary",
    callbackOnClick: (e) => toggleCompleteTodo(todo.id),
    children: todo.isCompleted ? "Uncomplete" : "Complete"
  });

  const deleteBtn = <HTMLButtonElement>createElement({
    type: "button",
    className: "btn text-danger",
    callbackOnClick: (e) => deleteTodo(todo.id),
    children: "Delete"
  });

  const editBtn = <HTMLButtonElement>createElement({
    type: "button",
    className: "btn text-secondary",
    callbackOnClick: (e) => editTodo(todo.id),
    children: "Edit"
  });

  const btnsContainer: HTMLElement = createElement({
    type: "div",
    children: [completeBtn, deleteBtn, editBtn]
  });

  const todoFooter: HTMLElement = createElement({
    type: "footer",
    className: "d-flex justify-content-between align-items-center",
    children: [todoBadge, btnsContainer]
  });

  const todoContainer: HTMLElement = createElement({
    type: "li",
    className: "list-group-item",
    children: [titleEl, todoFooter]
  });

  return todoContainer;
}

function createElement(attributes: HTMLAttributes): HTMLElement {
  const { type, className, callbackOnClick, children } = attributes;
  const el = document.createElement(type);
  
  if(typeof className === "string")
    el.className = <string>className;

  if(typeof callbackOnClick === "function")
    el.addEventListener('click', <EventListener>callbackOnClick);

  if(typeof children === "string")
    el.textContent = <string>children;
  else if(children instanceof HTMLElement)
    el.appendChild(children);
  else if(isArray(children) && children?.every(c => c instanceof HTMLElement))
    children.forEach(c => el.appendChild(c));

  return el;
}

function isArray(arr: any): boolean {
  return (
    Array.isArray(arr) &&
    Object.prototype.toString.call(arr) === "[object Array]"
  )
}

// Actions
function deleteTodo(id: Todo["id"]): void {
  let validation = confirm("Are you sure you want to delete this todo?");
  if(validation) {
    todos = todos.filter(todo => todo.id !== id);
    updateTodos();
  }
}

function editTodo(id: Todo["id"]): void {
  let newTodoTitle: string | null = prompt('Enter the new todo title: ');

  if(newTodoTitle !== null && !isEmpty(newTodoTitle)) {
    let todoIndex: number = todos.findIndex(todo => todo.id === id);
    
    if(todoIndex !== -1) {
      todos[todoIndex].title = newTodoTitle;
      updateTodos();
    }
  }
}

function toggleCompleteTodo(id: Todo["id"]): void {
  const todoIndex: number = todos.findIndex(todo => todo.id === id);
  const currentCompleted: boolean = todos[todoIndex].isCompleted;

  todos[todoIndex].isCompleted = !currentCompleted;
  updateTodos();
}

// End methods

updateTodos();

todoInput.addEventListener('input', function(e) {
  newTodo = this.value;
});

todoInput.addEventListener('keydown', function(e) {
  if(e.key === "Enter") {
    addTodo(newTodo);
  }
})

addBtn.addEventListener('click', function() {
  addTodo(newTodo);
});