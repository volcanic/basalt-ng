import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './pages/main/main.component';
import {TaskletResolver} from './resolver/tasklet.resolver';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: ':id', component: MainComponent, resolve: {tasklet: TaskletResolver}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimelineRoutingModule {
}
