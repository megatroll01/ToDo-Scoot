import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: any[] = [];
  newTodo: any = {};
  filter: string = '';
  priority: number = 0;
  fieldValid: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todos = [];
    const apiUrl = 'http://localhost:3000/api/todo-items';
    this.http.get<any[]>(apiUrl).subscribe(
      todos => {
        this.todos = this.filterTodos(todos);
      },
      error => {
        console.error('Error loading todos', error);
      }
    );
  }
  
  filterTodos(todos: any[]): any[] {
    let filteredTodos = todos;
  
    if (this.filter) {
      const filterRegex = new RegExp(this.filter, 'i');
      filteredTodos = filteredTodos.filter(todo =>
        filterRegex.test(todo.description)
      );
    }
  
    if (this.priority != 0) {
      filteredTodos = filteredTodos.filter(todo => todo.priority === this.priority);
    }
  
    return filteredTodos;
  }

  updateFilter() {
    this.loadTodos();
  }

  addTodo() {

    this.fieldValid = true;

    if (!this.newTodo.title || !this.newTodo.description || !this.newTodo.dueDate || !this.newTodo.priority) {
      this.fieldValid = false;
      return;
    }

    const apiUrl = 'http://localhost:3000/api/todo-items';
    this.newTodo.done = 1; // Adiciona automaticamente o valor 1 para 'done'
    
    this.http.post<any>(apiUrl, this.newTodo).subscribe(
      response => {
        this.newTodo.id = response.id;
        this.todos.push(this.newTodo);
        this.newTodo = {};
      },
      error => {
        console.error('Error adding todo', error);
      }
    );
  }

  updateTodo(todo: any) {
    const apiUrl = `http://localhost:3000/api/todo-items/${todo.id}`;
    this.http.put(apiUrl, todo).subscribe(
      () => {
        console.log('Todo updated');
      },
      error => {
        console.error('Error updating todo', error);
      }
    );
  }

  markAsDone(todo: any) {
    todo.done = 2;
  
    const apiUrl = `http://localhost:3000/api/todo-items/${todo.id}`;
    this.http.put(apiUrl, todo).subscribe(
      () => {
        console.log('Todo marked as done');
      },
      error => {
        console.error('Error marking todo as done', error);
      }
    );
  }

  deleteTodo(todo: any) {
    const apiUrl = `http://localhost:3000/api/todo-items/${todo.id}`;
    this.http.delete(apiUrl).subscribe(
      () => {
        console.log('Todo deleted');
      },
      error => {
        console.error('Error deleting todo', error);
      }
    );
    this.loadTodos();
  }
}
