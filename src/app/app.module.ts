import {AppComponent} from './app.component';
import {NgModule} from '@angular/core';
import {AppImports} from './app.imports';
import {AppDeclarations} from './app.declarations';

@NgModule({
  declarations: [AppDeclarations],
  imports: [AppImports],
  entryComponents: [],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {

}
