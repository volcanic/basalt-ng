import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {SettingsService} from '../core/settings/services/settings.service';
import {FeatureService} from '../core/settings/services/feature.service';
import {SettingType} from '../core/settings/model/setting-type.enum';

/**
 * Checks if it is necessary to show intro page
 */
@Injectable({
  providedIn: 'root',
})
export class IntroGuard implements CanActivate {

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
      this.settingsService.settingsSubject.subscribe(value => {
        if (this.isFeatureMissing() || this.isSemaphoreSet()) {
          resolve(true);
        } else {
          this.router.navigate([`/timeline`]);
          resolve(false);
        }
      });
    });
  }

  /**
   * Determines if semaphore is set
   */
  private isSemaphoreSet(): boolean {
    const sempahore = this.settingsService.settings.get(SettingType.SEMAPHORE_FEATURE);
    return sempahore != null && sempahore.value != null && sempahore.value;
  }

  /**
   * Determines if a feature is missing
   */
  private isFeatureMissing(): boolean {
    return this.featureService.features.some(feature => {
      return (this.settingsService.settings.get(feature.settingType) == null);
    });
  }
}
