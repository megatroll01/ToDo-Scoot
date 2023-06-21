import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent  } from './todo-list/todo-list.component';

const routes: Routes = [
  { path: 'toDo', component: TodoListComponent },
  { path: '', redirectTo: '/toDo', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
