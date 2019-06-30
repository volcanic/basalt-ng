import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Scope} from '../model/scope.enum';
import {ThemeService} from '../../ui/services/theme.service';
import {Theme} from '../../ui/model/theme.enum';

/**
 * Handles scope
 */
@Injectable({
  providedIn: 'root'
})
export class ScopeService {

  /** Current scope */
  scope: Scope = Scope.WORK;
  /** Subject that publishes scope */
  scopeSubject = new Subject<Scope>();

  /**
   * Constructor
   * @param themeService theme service
   */
  constructor(private themeService: ThemeService) {
  }

  /**
   * Switches scope
   * @param scope new scope
   */
  switchScope(scope: Scope) {
    if (scope !== this.scope) {
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
}
