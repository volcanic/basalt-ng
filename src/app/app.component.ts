import {Component, OnInit} from '@angular/core';
import {SnackbarService} from './services/snackbar.service';
import {PouchDBService} from './services/pouchdb.service';
import {MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {TaskletsService} from './services/tasklets.service';
import {environment} from '../environments/environment';
import {GitTag} from './model/git-tag.model';
import {NewFeaturesDialogComponent} from './view/dialogs/new-features-dialog/new-features-dialog.component';
import {SettingsService} from './services/settings.service';
import {PouchDBSettingsService} from './services/pouchdb-settings.service';
import {Settings} from './model/settings/settings.model';

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

    const dialogRef = this.dialog.open(NewFeaturesDialogComponent, {
      disableClose: false,
      data: {
        dialogTitle: 'New features',
        gitTags: environment.TAGS as GitTag[]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const settings = new Settings();
        settings.id = 'version';
        settings.value = result;
        this.settingsService.setSettings(settings);
      }
    });

    this.taskletsService.fetch();
    this.snackbarService.messageSubject.subscribe(
      (snack) => {
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
}
