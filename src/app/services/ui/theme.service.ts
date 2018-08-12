import {Injectable} from '@angular/core';
import {Theme} from '../../model/ui/theme.enum';
import {Subject} from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  theme: Theme = Theme.LIGHT;
  themeSubject = new Subject<Theme>();

  constructor() {
  }

  switchTheme(theme: Theme) {
    this.themeSubject.next(theme);
  }
}
