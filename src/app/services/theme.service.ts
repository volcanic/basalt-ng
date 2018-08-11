import {Injectable} from '@angular/core';
import {THEME} from '../model/theme.enum';
import {Subject} from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  theme: THEME = THEME.LIGHT;
  themeSubject = new Subject<THEME>();

  constructor() {
  }

  switchTheme(theme: THEME) {
    this.themeSubject.next(theme);
  }
}
