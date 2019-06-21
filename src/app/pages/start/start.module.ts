import {NgModule} from '@angular/core';
import {StartComponent} from './pages/start/start.component';
import {StartImports} from './start.imports';
import {StartProviders} from './start.providers';
import {NotificationComponent} from './pages/notfication/notification.component';

@NgModule({
  declarations: [
    StartComponent,
    NotificationComponent
  ],
  imports: [StartImports],
  providers: [StartProviders],
  entryComponents: [
    StartComponent
  ], exports: [
    StartComponent
  ]
})
export class StartModule {
}
