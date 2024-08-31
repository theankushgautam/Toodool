import { Storage } from './Storage';

export class Todo {
  static idCounter = Storage.lastIdCount() || 0;

  constructor(title, todoItems, dateCreated) {
    this.id = ++Todo.idCounter;
    this.title = title;
    this.todoItems = todoItems; // Array of todo items
    this.dateCreated = dateCreated;
  }
}
