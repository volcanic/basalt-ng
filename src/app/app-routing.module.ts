import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CalendarComponent} from './view/pages/calendar/calendar.component';
import {TimelineComponent} from './view/pages/timeline/timeline.component';

const routes: Routes = [
  {path: '', redirectTo: '/timeline', pathMatch: 'full'},
    {path: 'timeline', component: TimelineComponent},
    {path: 'calendar', component: CalendarComponent}
  ]
;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
