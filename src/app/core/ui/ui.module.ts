import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeService} from './services/theme.service';
import {SnackbarService} from './services/snackbar.service';
import {MediaService} from './services/media.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    MediaService,
    SnackbarService,
    ThemeService
  ]
})
export class UiModule {
}
