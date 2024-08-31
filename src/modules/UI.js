import { Todo } from './Todo';
import { Storage } from './Storage';
import { format } from 'date-fns';

export class UI {
  static init() {
    this.displayRetrieveTodos();
    this.toggleTodoForm();
    this.toggleTheme();
    this.clearInputFields();
    this.deleteItemRow();

    this.saveTodo(); //entry point
  }

  //display retrived data from storage on refresh
  static displayRetrieveTodos() {
    const todoObject = Storage.retrieveAllTodos();
    const todoArray = Object.values(todoObject);

    todoArray.forEach((todo) => {
      this.displayTodoOnPage(todo);
    });
  }

  //clear input fields
  static clearInputFields() {
    const title = document.querySelector('#todo-title');
    const itemsContainer = document.querySelector('.todo-items-container');
    const itemRows = document.querySelectorAll('.todo-item-row');

    title.value = '';

    //remove all created item rows
    itemRows.forEach((item) => {
      itemsContainer.removeChild(item);
    });

    this.createNewItemRow(); //add only one item row
  }

  //Event: if user hits save button
  static saveTodo() {
    const saveBtn = document.querySelector('#save-btn');

    saveBtn.removeEventListener('click', () => this.addTodo()); // Remove if already present
    saveBtn.addEventListener('click', () => this.addTodo());
  }

  //add user input todo item
  static addTodo() {
    const title = document.querySelector('#todo-title').value;
    const todoItems = this.getTodoItemsList(); //get todo-items list array
    const dateCreated = this.getFormattedDate();

    //instantitate Todo object
    const newTodo = new Todo(title, todoItems, dateCreated);

    this.displayTodoOnPage(newTodo); //display on page
    Storage.storeTodo(newTodo); //save on local Storage

    this.clearInputFields(); //reset input field after saving
  }

  static getTodoItemsList() {
    const todoItemsArray = [];

    // Initialize the array to store the to-do items
    const itemRows = document.querySelectorAll('.todo-item-row');

    // Push the data from each row into the array
    itemRows.forEach((itemRow) => {
      const data = this.getTodoItemData(itemRow);
      //if not empty push on the array
      if (data.todoItem !== '') todoItemsArray.push(data);
    });

    return todoItemsArray;
  }

  //display added Item on the page
  static displayTodoOnPage(todo) {
    const todoDisplayContainer = document.querySelector(
      '.todo-display-container'
    );
    const todoCard = document.createElement('div');
    todoCard.classList.add('display-card');

    //creating dynamic <li> for todo-items array
    let list = [];

    todo.todoItems.forEach((item) => {
      const text = item.isComplete ? 'line-through' : 'none';
      const li = `<li style="text-decoration:${text}">${item.todoItem}</li>`;
      list.push(li);
    });

    todoCard.innerHTML = `
      <h3>${todo.title}</h3>
      <ul>${list.join('')}</ul>
      <span>${todo.dateCreated}</li>
    `;

    todoDisplayContainer.appendChild(todoCard);
  }

  //get item data of a row - isComplete, item-descrip, listen for delete
  static getTodoItemData(parentElement) {
    const todoItem = parentElement.querySelector('.todo-item').value;
    const isComplete = parentElement.querySelector('.isComplete').checked;
    return { todoItem, isComplete };
  }

  //delete item row
  static deleteItemRow() {
    const deleteButtons = document.querySelectorAll('.delete-todo-item');

    deleteButtons.forEach((btn) => {
      btn.addEventListener('click', (event) => this.removeTodoItem(event));
    });
  }

  //create new item row with [checkbox, item-description, delete]
  static createNewItemRow() {
    const itemsContainer = document.querySelector('.todo-items-container');
    const newRow = document.createElement('div');
    newRow.classList.add('todo-item-row');

    newRow.innerHTML = `
    <input type="checkbox" name="isComplete" class="isComplete" />
    <input type="text" name="todo-item" placeholder="+ New Item" class="todo-item" />
    <span class="material-symbols-outlined icon delete-todo-item">
     delete
    </span>`;

    // Attach the input event listener directly to the new row's input field
    const newTodoItem = newRow.querySelector('.todo-item');
    newTodoItem.addEventListener(
      'input',
      () => {
        if (newTodoItem.value.length === 1) this.createNewItemRow();
      },
      { once: true }
    );

    //also add delete row event listener for new rows
    this.deleteItemRow();
    itemsContainer.appendChild(newRow);
  }

  static removeTodoItem(event) {
    const parentElement = event.target.parentElement;
    if (parentElement) parentElement.remove();
  }

  //get formatted date
  static getFormattedDate() {
    const now = new Date();
    return format(now, 'yyy-MM-dd hh:mm');
  }

  // display form container for input
  static toggleTodoForm() {
    const todoFormWrapper = document.querySelector('.todo-form-wrapper');
    const overlayDiv = document.querySelector('#overlay-effect');

    // listen for + New Todo button
    document.querySelector('#new-todo-btn').addEventListener('click', () => {
      this.clearInputFields(); //reset input field before opening

      this.deleteItemRow();

      overlayDiv.classList.toggle('overlay');
      todoFormWrapper.classList.toggle('hidden');
    });

    //also listen for close form button
    document.querySelector('#close-form-btn').addEventListener('click', () => {
      todoFormWrapper.classList.add('hidden');
      overlayDiv.classList.toggle('overlay');

      this.clearInputFields(); //reset input field after closing
    });

    //also listen for save btn: form should close after hitting save
    document.querySelector('#save-btn').addEventListener('click', () => {
      todoFormWrapper.classList.add('hidden');
      overlayDiv.classList.toggle('overlay');
    });
  }

  // toggle between light and dark theme
  static toggleTheme() {
    const themeButton = document.querySelector('#mode-toggle');

    themeButton.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      document.body.classList.toggle('dark-mode');

      //change theme icon
      if (document.body.classList.contains('dark-mode'))
        themeButton.textContent = 'light_mode';
      else themeButton.textContent = 'dark_mode';
    });
  }
}
