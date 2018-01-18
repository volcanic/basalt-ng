import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TaskletsComponent} from './view/pages/tasklets/tasklets.component';
import {TodosComponent} from './view/pages/todos/todos.component';

const routes: Routes = [
    {path: '', redirectTo: 'tasklets', pathMatch: 'full'},
    {path: 'tasklets', component: TaskletsComponent},
    {path: 'todos', component: TodosComponent}
  ]
;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
