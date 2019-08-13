import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {SettingsService} from '../core/settings/services/settings.service';
import {FeatureService} from '../core/settings/services/feature.service';
import {SettingType} from '../core/settings/model/setting-type.enum';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Setting} from '../core/settings/model/setting.model';

/**
 * Checks if it is necessary to show intro page
 */
@Injectable({
  providedIn: 'root',
})
export class IntroGuard implements CanActivate {

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param router router
   * @param featureService feature service
   * @param settingsService settings service
   */
  constructor(private router: Router,
              private featureService: FeatureService,
              private settingsService: SettingsService) {
  }

  /**
   * Checks if the guarded route can be activated
   * @param next activated route
   * @param state router state
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      this.settingsService.fetch();
      this.settingsService.settingsSubject.pipe(
        takeUntil(this.unsubscribeSubject
        )).subscribe((value) => {
        if (value != null) {
          const settingsMap = value as Map<string, Setting>;

          this.unsubscribeSubject.next();
          this.unsubscribeSubject.complete();

          if (SettingsService.isSettingActive(SettingType.ONBOARDING_DONE, settingsMap)) {
            this.router.navigate([`/timeline`]);
            resolve(false);
          }
        }

        resolve(true);
      });
    });
  }
}
