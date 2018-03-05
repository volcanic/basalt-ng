import {Injectable, isDevMode} from '@angular/core';
import {Settings} from '../model/settings/settings.model';
import {PouchDBSettingsService} from './pouchdb-settings.service';

@Injectable()
export class SettingsService {
  settings: Settings;

  constructor(private pouchDBSettingsService: PouchDBSettingsService) {
    this.pouchDBSettingsService.getChangeListener().subscribe(
      item => {
        console.log(`DEBUG SettingsService item`);
        (item['change']['docs']).forEach(d => {
          this.settings = d as Settings;
        });
      });
  }

  public setSettings(settings: Settings) {
    this.settings = settings;
    this.pouchDBSettingsService.put(settings.id, settings);
  }

  public getSettings() {
    return this.settings;
  }

  /**
   * Retrieves data from PouchDB
   */
  public fetch() {
    this.settings = null;
    this.pouchDBSettingsService.fetch().then(result => {
        result.rows.forEach(r => {
          const settings = r.doc as Settings;
          console.log(`DEBUG fetch settings ${settings.id}`);
          this.settings = settings;
        });
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

}
