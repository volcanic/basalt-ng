import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './pages/main/main.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  // {path: ':id', component: MainComponent},
  {path: 'task/:id', component: MainComponent},
  {path: 'tasklet/:id', component: MainComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimelineRoutingModule {
}
