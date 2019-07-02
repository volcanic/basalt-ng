import {NgModule} from '@angular/core';
import {StopWatchComponent} from './stop-watch/stop-watch.component';
import {StopWatchImports} from './stop-watch.imports';
import {StopWatchDeclarations} from './stop-watch.declaration';

@NgModule({
  imports: [StopWatchImports],
  declarations: [StopWatchDeclarations],
  entryComponents: [
    StopWatchComponent
  ],
  exports: [
    StopWatchComponent
  ]
})
export class StopWatchModule {
}
