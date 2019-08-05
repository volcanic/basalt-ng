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
  settingsMap = new Map<string, Setting>();
  /** Subject that publishes changes in settings */
  settingsSubject = new Subject<Map<string, Setting>>();

  //
  // Static methods
  //

  /**
   * Determines if a setting is active
   * @param settingType setting type
   * @param settingsMap setting map
   */
  static isSettingActive(settingType: SettingType, settingsMap: Map<string, Setting>): boolean {
    const setting = settingsMap.get(settingType);

    return setting != null && setting.value != null && JSON.parse(setting.value) === true;
  }

  /**
   * Constructor
   * @param pouchDBSettingsService pouchDB settings service
   */
  constructor(private pouchDBSettingsService: PouchDBSettingsService) {
    this.pouchDBSettingsService.getChangeListener().subscribe(
      item => {
        (item['change']['docs']).forEach(d => {
          const setting = d as Setting;
          this.settingsMap.set(setting.id, setting);
        });
        this.notify();
      });
  }

  /**
   * Updates a setting
   * @param setting setting to be updated
   */
  public updateSetting(setting: Setting) {
    this.settingsMap.set(setting.id, setting);
    this.pouchDBSettingsService.put(setting.id, setting);
    this.notify();
  }

  /**
   * Retrieves data from PouchDB
   */
  public fetch() {
    this.settingsMap.clear();
    this.pouchDBSettingsService.fetch().then(result => {
        if (result != null) {
          result.rows.forEach(r => {
            const setting = r.doc as Setting;
            this.settingsMap.set(setting.id, setting);
          });

          this.notify();
        }
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  //
  // Notification
  //

  /**
   * Notifies subscribers that something has changed
   */
  private notify() {
    this.settingsSubject.next(this.settingsMap);
  }
}
