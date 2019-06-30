import {Injectable, isDevMode} from '@angular/core';
import {Setting} from '../model/setting.model';
import {PouchDBSettingsService} from '../../persistence/services/pouchdb-settings.service';
import {Subject} from 'rxjs';
import {SettingType} from '../model/setting-type.enum';

/**
 * Handles settings
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  /** Map of current settings */
  settings = new Map<string, Setting>();
  /** Subject that publishes changes in settings */
  settingsSubject = new Subject<Map<string, Setting>>();

  /**
   * Constructor
   * @param pouchDBSettingsService pouchDB settings service
   */
  constructor(private pouchDBSettingsService: PouchDBSettingsService) {
    this.pouchDBSettingsService.getChangeListener().subscribe(
      item => {
        (item['change']['docs']).forEach(d => {
          const setting = d as Setting;
          this.settings.set(setting.id, setting);
        });
        this.notify();
      });
  }

  /**
   * Updates a setting
   * @param setting setting to be updated
   */
  public updateSetting(setting: Setting) {
    this.settings.set(setting.id, setting);
    this.pouchDBSettingsService.put(setting.id, setting);
    this.notify();
  }

  /**
   * Retrieves data from PouchDB
   */
  public fetch() {
    this.settings.clear();
    this.pouchDBSettingsService.fetch().then(result => {
        result.rows.forEach(r => {
          const setting = r.doc as Setting;
          this.settings.set(setting.id, setting);
        });

        this.notify();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  /**
   * Determines if a setting is active
   * @param settingType setting type
   */
  public isSettingActive(settingType: SettingType): boolean {
    const setting = this.settings.get(settingType);

    return setting != null && setting.value != null && JSON.parse(setting.value) === true;
  }

  //
  // Notification
  //

  /**
   * Notifies subscribers that something has changed
   */
  private notify() {
    this.settingsSubject.next(this.settings);
  }
}
