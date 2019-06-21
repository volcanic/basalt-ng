import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StartComponent} from './pages/start/start.component';
import {NotificationComponent} from './pages/notfication/notification.component';

const routes: Routes = [
  {path: 'notification', component: NotificationComponent},
  {path: '', component: StartComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartRoutingModule {
}
