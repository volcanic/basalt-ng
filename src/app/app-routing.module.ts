import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SplashScreenComponent} from './view/pages/splash-screen/splash-screen.component';
import {CalendarComponent} from './view/pages/calendar/calendar.component';
import {TimelineComponent} from './view/pages/timeline/timeline.component';

const routes: Routes = [
    {path: '', component: SplashScreenComponent},
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
