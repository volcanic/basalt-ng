import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TaskletsComponent} from './view/pages/tasklets/tasklets.component';
import {SplashScreenComponent} from './view/pages/splash-screen/splash-screen.component';
import {CalendarComponent} from './view/pages/calendar/calendar.component';

const routes: Routes = [
    {path: '', component: SplashScreenComponent},
    {path: 'tasklets', component: TaskletsComponent},
    {path: 'calendar', component: CalendarComponent}
  ]
;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
