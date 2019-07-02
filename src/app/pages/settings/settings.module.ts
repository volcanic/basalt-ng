import {NgModule} from '@angular/core';
import {SettingsComponent} from './pages/settings/settings.component';
import {SettingsImports} from './settings.imports';
import {SettingsDeclarations} from './settings.declaration';

@NgModule({
  imports: [SettingsImports],
  declarations: [SettingsDeclarations],
  entryComponents: [
    // Pages
    SettingsComponent
  ]
})
export class SettingsModule {
}
