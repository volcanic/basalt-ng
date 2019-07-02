import {MaterialColorService} from './services/material-color.service';
import {ColorService} from './services/color.service';
import {MediaService} from './services/media.service';
import {SnackbarService} from './services/snackbar.service';
import {ThemeService} from './services/theme.service';

/** Providers for ui module */
export const UiProviders = [
  ColorService,
  MaterialColorService,
  MediaService,
  SnackbarService,
  ThemeService
];
