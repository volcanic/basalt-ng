import {NgModule} from '@angular/core';
import {PersonIndicatorButtonComponent} from './person-indicator-button/person-indicator-button.component';
import {PersonIndicatorButtonDeclarations} from './person-indicator-button.declaration';
import {PersonIndicatorButtonImports} from './person-indicator-button.imports';

@NgModule({
  imports: [PersonIndicatorButtonImports],
  declarations: [PersonIndicatorButtonDeclarations],
  exports: [PersonIndicatorButtonComponent]
})
export class PersonIndicatorButtonModule {
}
