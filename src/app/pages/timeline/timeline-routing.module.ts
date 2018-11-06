import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './pages/main/main.component';
import {TaskletResolver} from './resolvers/tasklet.resolver';
import {TaskResolver} from './resolvers/task.resolver';

const routes: Routes = [
  {path: '', component: MainComponent},
  // {path: ':id', component: MainComponent, resolve: {task: TaskletResolver}},
  {path: 'task/:id', component: MainComponent, resolve: {task: TaskResolver}},
  {path: 'tasklet/:id', component: MainComponent, resolve: {tasklet: TaskletResolver}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimelineRoutingModule {
}
