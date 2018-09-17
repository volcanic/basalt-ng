import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: '/timeline', pathMatch: 'full'},
    {path: 'timeline', loadChildren: './pages/timeline/timeline.module#TimelineModule'},
    {path: 'calendar', loadChildren: './pages/calendar/calendar.module#CalendarModule'}
  ]
;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
