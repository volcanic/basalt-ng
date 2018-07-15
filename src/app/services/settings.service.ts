import {Injectable, isDevMode} from '@angular/core';
import {Setting} from '../model/settings/setting.model';
import {PouchDBSettingsService} from './pouchdb-settings.service';
import {Subject} from 'rxjs';

@Injectable()
export class SettingsService {
  settings = new Map<String, Setting>();
  settingsSubject = new Subject<Map<String, Setting>>();

  constructor(private pouchDBSettingsService: PouchDBSettingsService) {
    this.pouchDBSettingsService.getChangeListener().subscribe(
      item => {
        (item['change']['docs']).forEach(d => {
          const setting = d as Setting;
          this.settings.set(setting.id, setting);
        });
        this.update();
      });
  }

  public updateSetting(setting: Setting) {
    this.settings.set(setting.id, setting);
    this.pouchDBSettingsService.put(setting.id, setting);
    this.update();
  }

  /**
   * Retrieves data from PouchDB
   */
  public fetch() {
    this.settings.clear();
    this.pouchDBSettingsService.fetch().then(result => {
        if (result.rows.length === 0) {
          this.setInitialEntries();
        }

        result.rows.forEach(r => {
          const setting = r.doc as Setting;
          this.settings.set(setting.id, setting);
        });

        this.update();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  private setInitialEntries() {
    this.updateSetting(new Setting('version', '0.0.0'));
  }

  public update() {
    this.settingsSubject.next(this.settings);
  }
}
