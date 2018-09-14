import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SnackbarService} from './core/ui/services/snackbar.service';
import {PouchDBService} from './services/persistence/pouchdb.service';
import {MatDialog, MatIconRegistry, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {environment} from '../environments/environment';
import {GitTag} from './model/util/git-tag.model';
import {NewFeaturesDialogComponent} from './view/dialogs/app-info/new-features-dialog/new-features-dialog.component';
import {SettingsService} from './services/persistence/settings.service';
import {PouchDBSettingsService} from './services/persistence/pouchdb-settings.service';
import {Setting} from './model/settings/setting.model';
import {EntityService} from './services/entities/entity.service';
import {DomSanitizer} from '@angular/platform-browser';
import {TaskService} from './services/entities/task.service';
import {TaskletService} from './services/entities/tasklet.service';
import {ThemeService} from './core/ui/services/theme.service';
import {OverlayContainer} from '@angular/cdk/overlay';

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
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} sanitizer
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
              private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              public dialog: MatDialog,
              public snackBar: MatSnackBar,) {
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
    this.initializeIcons();
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

      if (settings.get('version') != null) {
        this.showNewFeatures(settings.get('version').value);
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
   * Initializes icons
   */
  private initializeIcons() {
    /** Root directory of material design icons */
    const ICON_ROOT_DIR = 'assets/material-design-icons';
    /** Icon variant */
    const VARIANT = 'production';

    /**
     * Represents a material design icon
     */
    class Icon {
      /** Topic */
      topic: string;
      /** Name */
      name: string;
      /** File */
      file: string;

      /**
       * Constructor
       * @param {string} topic
       * @param {string} name
       * @param {string} file
       */
      constructor(topic: string, name: string, file: string) {
        this.topic = topic;
        this.name = name;
        this.file = file;
      }
    }

    const ACTION = 'action';
    const ALERT = 'alert';
    const AV = 'av';
    const CONTENT = 'content';
    const COMMUNICATION = 'communication';
    const DEVICE = 'device';
    const EDITOR = 'editor';
    const FILE = 'file';
    const IMAGE = 'image';
    const MAPS = 'maps';
    const NAVIGATION = 'navigation';
    const SOCIAL = 'social';

    const icons: Icon[] = [];
    icons.push(new Icon(ACTION, 'agenda', 'ic_view_agenda_24px.svg'));
    icons.push(new Icon(ACTION, 'android', 'ic_android_24px.svg'));
    icons.push(new Icon(ACTION, 'bug_report', 'ic_bug_report_24px.svg'));
    icons.push(new Icon(ACTION, 'check_circle', 'ic_check_circle_24px.svg'));
    icons.push(new Icon(ACTION, 'code', 'ic_code_24px.svg'));
    icons.push(new Icon(ACTION, 'label_outline', 'ic_label_outline_24px.svg'));
    icons.push(new Icon(ACTION, 'lightbulb_outline', 'ic_lightbulb_outline_24px.svg'));
    icons.push(new Icon(ACTION, 'receipt', 'ic_receipt_24px.svg'));
    icons.push(new Icon(ACTION, 'search', 'ic_search_24px.svg'));
    icons.push(new Icon(ACTION, 'today', 'ic_today_24px.svg'));
    icons.push(new Icon(ACTION, 'turned_in', 'ic_turned_in_24px.svg'));
    icons.push(new Icon(ACTION, 'turned_in_not', 'ic_turned_in_not_24px.svg'));
    icons.push(new Icon(ACTION, 'work', 'ic_work_24px.svg'));
    icons.push(new Icon(ALERT, 'warning', 'ic_warning_24px.svg'));
    icons.push(new Icon(AV, 'play_circle_filled', 'ic_play_circle_filled_24px.svg'));
    icons.push(new Icon(AV, 'replay', 'ic_replay_24px.svg'));
    icons.push(new Icon(COMMUNICATION, 'business', 'ic_business_24px.svg'));
    icons.push(new Icon(COMMUNICATION, 'call', 'ic_call_24px.svg'));
    icons.push(new Icon(COMMUNICATION, 'chat', 'ic_chat_24px.svg'));
    icons.push(new Icon(COMMUNICATION, 'email', 'ic_email_24px.svg'));
    icons.push(new Icon(COMMUNICATION, 'phone', 'ic_phone_24px.svg'));
    icons.push(new Icon(CONTENT, 'add', 'ic_add_24px.svg'));
    icons.push(new Icon(CONTENT, 'flag', 'ic_flag_24px.svg'));
    icons.push(new Icon(CONTENT, 'filter_list', 'ic_filter_list_24px.svg'));
    icons.push(new Icon(CONTENT, 'mail', 'ic_mail_24px.svg'));
    icons.push(new Icon(CONTENT, 'people_18', 'ic_people_18px.svg'));
    icons.push(new Icon(CONTENT, 'reply', 'ic_reply_24px.svg'));
    icons.push(new Icon(DEVICE, 'brightness_low', 'ic_brightness_low_24px.svg'));
    icons.push(new Icon(EDITOR, 'delete', 'ic_delete_24px.svg'));
    icons.push(new Icon(EDITOR, 'mode_edit', 'ic_mode_edit_24px.svg'));
    icons.push(new Icon(EDITOR, 'mode_edit_18', 'ic_mode_edit_18px.svg'));
    icons.push(new Icon(EDITOR, 'short_text', 'ic_short_text_24px.svg'));
    icons.push(new Icon(FILE, 'file_download', 'ic_file_download_24px.svg'));
    icons.push(new Icon(FILE, 'file_upload', 'ic_file_upload_24px.svg'));
    icons.push(new Icon(IMAGE, 'timer', 'ic_timer_24px.svg'));
    icons.push(new Icon(IMAGE, 'brightness_3', 'ic_brightness_3_24px.svg'));
    icons.push(new Icon(IMAGE, 'nature', 'ic_nature_24px.svg'));
    icons.push(new Icon(MAPS, 'directions_run', 'ic_directions_run_24px.svg'));
    icons.push(new Icon(MAPS, 'local_dining', 'ic_local_dining_24px.svg'));
    icons.push(new Icon(MAPS, 'layers_clear', 'ic_layers_clear_24px.svg'));
    icons.push(new Icon(NAVIGATION, 'check', 'ic_check_24px.svg'));
    icons.push(new Icon(NAVIGATION, 'chevron_right', 'ic_chevron_right_24px.svg'));
    icons.push(new Icon(NAVIGATION, 'close_18', 'ic_close_18px.svg'));
    icons.push(new Icon(NAVIGATION, 'expand_more', 'ic_expand_more_24px.svg'));
    icons.push(new Icon(NAVIGATION, 'menu', 'ic_menu_24px.svg'));
    icons.push(new Icon(NAVIGATION, 'more_vert', 'ic_more_vert_24px.svg'));
    icons.push(new Icon(NAVIGATION, 'refresh', 'ic_refresh_24px.svg'));
    icons.push(new Icon(SOCIAL, 'person', 'ic_person_24px.svg'));
    icons.push(new Icon(SOCIAL, 'people', 'ic_people_24px.svg'));

    icons.forEach(icon => {
      this.iconRegistry.addSvgIcon(icon.name,
        this.sanitizer.bypassSecurityTrustResourceUrl(ICON_ROOT_DIR + '/' + icon.topic + '/svg/' + VARIANT + '/' + icon.file));
    });

    this.iconRegistry.addSvgIcon('blank', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_blank_24px.svg'));
    this.iconRegistry.addSvgIcon('scrum',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_scrum_black_24px.svg'));
    this.iconRegistry.addSvgIcon('outlined_flag',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-outlined_flag-24px.svg'));
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
        this.settingsService.updateSetting(new Setting('version', environment.VERSION));
      });
    }
  }
}
