import {Component, OnInit} from '@angular/core';
import {SnackbarService} from './services/snackbar.service';
import {PouchDBService} from './services/pouchdb.service';
import {MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {TaskletsService} from './services/tasklets.service';
import {environment} from '../environments/environment';
import {GitTag} from './model/git-tag.model';
import {NewFeaturesDialogComponent} from './view/dialogs/app-info/new-features-dialog/new-features-dialog.component';
import {SettingsService} from './services/settings.service';
import {PouchDBSettingsService} from './services/pouchdb-settings.service';
import {Setting} from './model/settings/setting.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [require('./app.component.scss')],
})
export class AppComponent implements OnInit {
  title = 'Basalt';

  constructor(private taskletsService: TaskletsService,
              private snackbarService: SnackbarService,
              private pouchDBService: PouchDBService,
              private pouchDBSettingsService: PouchDBSettingsService,
              private settingsService: SettingsService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.settingsService.fetch();
    this.settingsService.settingsSubject.subscribe(settings => {

      if (settings.get('version') != null) {
        console.log(`latest version ${settings.get('version').value}`);
        this.showNewFeatures(settings.get('version').value);
      }
    });


    this.taskletsService.fetch();
    this.snackbarService.messageSubject.subscribe(snack => {
        this.openSnackBar(snack[0], snack[1]);
      }
    );

    this.pouchDBService.sync('http://localhost:5984/basalt');
    this.pouchDBSettingsService.sync('http://localhost:5984/basalt_settings');
  }

  /**
   * Handles messages that shall be displayed in a snack bar
   * @param message
   * @param action
   */
  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, <MatSnackBarConfig>{
      duration: 5000,
    });
  }

  private showNewFeatures(currentVersion: string) {
    // Current version
    const currentMajor = Number.parseInt(environment.VERSION.split('.')[0]);
    const currentMinor = Number.parseInt(environment.VERSION.split('.')[1]);
    const currentPatch = Number.parseInt(environment.VERSION.split('.')[2]);

    // Latest version
    const latestMajor = Number.parseInt(currentVersion.split('.')[0]);
    const latestMinor = Number.parseInt(currentVersion.split('.')[1]);
    const latestPatch = Number.parseInt(currentVersion.split('.')[2]);

    if ((currentMajor > latestMajor)
      || (currentMajor === latestMajor && currentMinor > latestMinor)
      || (currentMajor === latestMajor && currentMinor === latestMinor && currentPatch > latestPatch)
    ) {

      const dialogRef = this.dialog.open(NewFeaturesDialogComponent, {
        disableClose: false,
        data: {
          dialogTitle: 'New features',
          gitTags: (environment.TAGS as GitTag[]).filter(gt => {
            gt.annotation = gt.annotation.replace(/.*v/g, '');

            // Tag version
            const tagMajor = Number.parseInt(gt.annotation.split('.')[0]);
            const tagMinor = Number.parseInt(gt.annotation.split('.')[1]);
            const tagPatch = Number.parseInt(gt.annotation.split('.')[2]);

            const relevant = ((tagMajor > latestMajor)
              || (tagMajor === latestMajor && tagMinor > latestMinor)
              || (tagMajor === latestMajor && tagMinor === latestMinor && tagPatch > latestPatch)
            );

            console.log(`tag version ${gt.annotation}, relevant: ${relevant}`);

            return relevant;
          })
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // Save latest version
        this.settingsService.updateSetting(new Setting('version', environment.VERSION));
      });
    }
  }
}
