import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Scope} from '../../../model/scope.enum';
import {ThemeService} from '../../ui/theme.service';
import {Theme} from '../../../model/ui/theme.enum';

@Injectable({
  providedIn: 'root'
})
export class ScopeService {

  scope: Scope = Scope.WORK;
  scopeSubject = new Subject<Scope>();

  constructor(private themeService: ThemeService) {
  }

  switchScope(scope: Scope) {
    this.scope = scope;
    switch (scope) {
      case Scope.WORK: {
        this.themeService.switchTheme(Theme.LIGHT);
        break;
      }
      case Scope.FREETIME: {
        this.themeService.switchTheme(Theme.DARK);
        break;
      }
    }

    this.scopeSubject.next(scope);
  }
}
