export class Storage {
  // Store a todo in localStorage
  static storeTodo(todo) {
    if (!todo || !todo.id) {
      console.error('Invalid todo object');
      return;
    }
    localStorage.setItem(todo.id, JSON.stringify(todo));
    console.log('Data stored successfully.');
  }

  // Retrieve all todos from localStorage
  static retrieveAllTodos() {
    if (localStorage.length < 0) return;

    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const jsonString = localStorage.getItem(key);
      try {
        const value = JSON.parse(jsonString);
        items[key] = value;
      } catch (e) {
        console.error(`Error parsing JSON for key ${key}: ${e}`);
      }
    }
    return items;
  }

  // Retrieve a todo by its ID
  static retrieveTodoById(id) {
    if (!id) {
      console.error('Invalid ID');
      return null;
    }
    const jsonString = localStorage.getItem(id);
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error(`Error parsing JSON for ID ${id}: ${e}`);
      return null;
    }
  }

  // Get the count of stored todos
  static lastIdCount() {
    return localStorage.length;
  }

  // Remove a todo from localStorage by its ID
  static removeTodo(id) {
    if (!id) {
      console.error('Invalid ID');
      return;
    }
    localStorage.removeItem(id);
    console.log('Todo removed successfully.');
  }
}
