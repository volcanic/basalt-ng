import {NgModule} from '@angular/core';
import {SettingsProviders} from './settings.providers';
import {SettingsImports} from './settings.imports';

@NgModule({
  imports: [SettingsImports],
  declarations: [],
  providers: [SettingsProviders]
})
export class SettingsModule {
}
