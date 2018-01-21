import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TaskletsComponent} from './view/pages/tasklets/tasklets.component';
import {TodosComponent} from './view/pages/todos/todos.component';
import {SplashScreenComponent} from './view/pages/splash-screen/splash-screen.component';

const routes: Routes = [
    {path: '', component: SplashScreenComponent},
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
