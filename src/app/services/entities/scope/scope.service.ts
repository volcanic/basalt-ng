import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Scope} from '../../../model/scope.enum';
import {ThemeService} from '../../../core/ui/services/theme.service';
import {Theme} from '../../../core/ui/model/theme.enum';

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
   * @param {ThemeService} themeService
   */
  constructor(private themeService: ThemeService) {
  }

  /**
   * Switches scope
   * @param {Scope} scope new scope
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
