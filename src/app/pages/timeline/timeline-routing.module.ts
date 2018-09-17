import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TimelineComponent} from './pages/timeline/timeline.component';

const routes: Routes = [
  {path: '', component: TimelineComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimelineRoutingModule {
}
