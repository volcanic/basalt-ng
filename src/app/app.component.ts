import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SnackbarService} from './core/ui/services/snackbar.service';
import {PouchDBService} from './core/persistence/services/pouchdb.service';
import {MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {environment} from '../environments/environment';
import {GitTag} from './core/settings/model/git-tag.model';
import {NewFeaturesDialogComponent} from './ui/new-features-dialog/new-features-dialog/new-features-dialog.component';
import {SettingsService} from './core/settings/services/settings.service';
import {PouchDBSettingsService} from './core/persistence/services/pouchdb-settings.service';
import {Setting} from './core/settings/model/setting.model';
import {EntityService} from './core/entity/services/entity.service';
import {TaskService} from './core/entity/services/task.service';
import {TaskletService} from './core/entity/services/tasklet.service';
import {ThemeService} from './core/ui/services/theme.service';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Settings} from './core/settings/model/settings.enum';

/**
 * Displays root element
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [require('./app.component.scss')],
})
export class AppComponent implements OnInit, AfterViewInit {

  /** App title */
  title = 'Basalt';

  /** Default app theme */
  themeClass = 'light-theme';

  /**
   * Constructor
   * @param {EntityService} entityService
   * @param {TaskService} taskService
   * @param {TaskletService} taskletService
   * @param {SnackbarService} snackbarService
   * @param {PouchDBService} pouchDBService
   * @param {PouchDBSettingsService} pouchDBSettingsService
   * @param {SettingsService} settingsService
   * @param {ThemeService} themeService
   * @param {OverlayContainer} overlayContainer
   * @param {MatDialog} dialog dialog
   * @param {MatSnackBar} snackBar snack bar
   */
  constructor(private entityService: EntityService,
              private taskService: TaskService,
              private taskletService: TaskletService,
              private snackbarService: SnackbarService,
              private pouchDBService: PouchDBService,
              private pouchDBSettingsService: PouchDBSettingsService,
              private settingsService: SettingsService,
              private themeService: ThemeService,
              private overlayContainer: OverlayContainer,
              public dialog: MatDialog,
              public snackBar: MatSnackBar) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeSettings();
    this.initializeTheme();
    this.initializeThemeSubscription();
    this.initializeSnackbar();
  }

  /**
   * Handles after-view-init lifecycle hook
   */
  ngAfterViewInit() {
    this.initializeDatabaseSync();
  }

  //
  // Initialization
  //

  /**
   * Initializes settings
   */
  private initializeSettings() {
    this.settingsService.fetch();
    this.settingsService.settingsSubject.subscribe(settings => {

      if (settings.get(Settings.VERSION) != null) {
        this.showNewFeatures(settings.get(Settings.VERSION).value);
      }

      // Initialize values
      if (this.settingsService.settings.get(Settings.POMODORO_DURATION) == null) {
        const setting = new Setting(Settings.POMODORO_DURATION, '25');
        this.settingsService.updateSetting(setting);
      }

      if (this.settingsService.settings.get(Settings.VERSION) == null) {
        const setting = new Setting(Settings.VERSION, '0.0.0');
        this.settingsService.updateSetting(setting);
      }
    });
  }

  /**
   * Initializes theme
   */
  private initializeTheme() {
    this.themeClass = this.themeService.theme;
    this.overlayContainer.getContainerElement().classList.add(this.themeService.theme);
  }

  /**
   * Initializes theme subscription
   */
  private initializeThemeSubscription() {
    this.themeService.themeSubject.subscribe(value => {

      this.themeClass = value;

      // Theme menus and dialogs
      const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
      const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme'));
      if (themeClassesToRemove.length) {
        overlayContainerClasses.remove(...themeClassesToRemove);
      }
      overlayContainerClasses.add(value);
    });
  }

  /**
   * Initializes snack bar
   */
  private initializeSnackbar() {
    this.snackbarService.messageSubject.subscribe(snack => {
        this.openSnackBar(snack[0], snack[1], snack[2]);
      }
    );
  }

  /**
   * Initializes database sync
   */
  private initializeDatabaseSync() {
    this.pouchDBService.sync(`http://localhost:5984/${environment.DATABASE_ENTITIES}`);
    this.pouchDBSettingsService.sync(`http://localhost:5984/${environment.DATABASE_SETTINGS}`);
  }

  //
  // Actions
  //

  /**
   * Handles messages that shall be displayed in a snack bar
   * @param message message to be displayed
   * @param actionName action name to be displayed
   * @param action action to be triggered if action name is clicked
   */
  private openSnackBar(message: string, actionName: string, action: any) {
    const snackbarRef = this.snackBar.open(message, actionName, <MatSnackBarConfig>{
      duration: 5000,
    });

    if (action != null) {
      snackbarRef.onAction().subscribe(action);
    }
  }

  /**
   * Handles display of new features dialog
   * @param {string} currentVersion
   */
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
      || (currentMajor === latestMajor && currentMinor === latestMinor && currentPatch > latestPatch)) {
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
      dialogRef.afterClosed().subscribe(() => {
        // Save latest version
        this.settingsService.updateSetting(new Setting(Settings.VERSION, environment.VERSION));
      });
    }
  }
}
