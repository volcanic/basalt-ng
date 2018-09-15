import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DigestModule} from './digest/digest.module';
import {PersistenceModule} from './persistence/persistence.module';
import {SettingsModule} from './settings/settings.module';
import {EntityModule} from './entity/entity.module';
import {UiModule} from './ui/ui.module';

@NgModule({
  imports: [
    CommonModule,

    DigestModule,
    EntityModule,
    PersistenceModule,
    SettingsModule,
    UiModule,
  ],
  declarations: []
})
export class CoreModule {
}
