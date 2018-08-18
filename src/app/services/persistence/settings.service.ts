import {Injectable, isDevMode} from '@angular/core';
import {Setting} from '../../model/settings/setting.model';
import {PouchDBSettingsService} from './pouchdb-settings.service';
import {Subject} from 'rxjs';

/**
 * Handles settings
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  /** Map of current settings */
  settings = new Map<String, Setting>();
  /** Subject that publishes changes in settings */
  settingsSubject = new Subject<Map<String, Setting>>();

  /**
   * Constructor
   * @param {PouchDBSettingsService} pouchDBSettingsService
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
   * @param {Setting} setting setting to be updated
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
        if (result.rows.length === 0) {
          this.initializeEntries();
        }

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
   * Initializes entries
   */
  private initializeEntries() {
    this.updateSetting(new Setting('version', '0.0.0'));
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
