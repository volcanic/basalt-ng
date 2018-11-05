import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IntroGuard} from './guards/intro.guard';

const routes: Routes = [
    {path: '', redirectTo: 'intro', pathMatch: 'full'},
    // Intro module
    {path: 'intro', loadChildren: './pages/intro/intro.module#IntroModule', canActivate: [IntroGuard]},
    // Timeline module
    {path: 'tasklet', loadChildren: './pages/timeline/timeline.module#TimelineModule'},
    {path: 'task/:id', loadChildren: './pages/timeline/timeline.module#TimelineModule'},
    {path: 'task', loadChildren: './pages/timeline/timeline.module#TimelineModule'},
    {path: 'tasklet/:id', loadChildren: './pages/timeline/timeline.module#TimelineModule'},
    {path: 'timeline', loadChildren: './pages/timeline/timeline.module#TimelineModule'},
    // Calendar module
    {path: 'calendar', loadChildren: './pages/calendar/calendar.module#CalendarModule'},
    // Settings module
    {path: 'settings', loadChildren: './pages/settings/settings.module#SettingsModule'},
    // Default
  ]
;

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
