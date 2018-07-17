import {Component, OnInit} from '@angular/core';
import {SnackbarService} from './services/snackbar.service';
import {PouchDBService} from './services/pouchdb.service';
import {MatDialog, MatIconRegistry, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {environment} from '../environments/environment';
import {GitTag} from './model/git-tag.model';
import {NewFeaturesDialogComponent} from './view/dialogs/app-info/new-features-dialog/new-features-dialog.component';
import {SettingsService} from './services/settings.service';
import {PouchDBSettingsService} from './services/pouchdb-settings.service';
import {Setting} from './model/settings/setting.model';
import {EntityService} from './services/entities/entity.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MediaService} from './services/media.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [require('./app.component.scss')],
})
export class AppComponent implements OnInit {
  title = 'Basalt';

  constructor(private entityService: EntityService,
              private snackbarService: SnackbarService,
              private pouchDBService: PouchDBService,
              private pouchDBSettingsService: PouchDBSettingsService,
              private settingsService: SettingsService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar,
              private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              private mediaService: MediaService) {
  }

  ngOnInit(): void {
    this.initializeSettings();
    this.initializeEntities();
    this.initializeIcons();
    this.initializeDatabaseSync();
  }

  initializeDatabaseSync() {
    this.pouchDBService.sync('http://localhost:5984/basalt');
    this.pouchDBSettingsService.sync('http://localhost:5984/basalt_settings');
  }

  initializeSettings() {
    this.settingsService.fetch();
    this.settingsService.settingsSubject.subscribe(settings => {

      if (settings.get('version') != null) {
        console.log(`latest version ${settings.get('version').value}`);
        this.showNewFeatures(settings.get('version').value);
      }
    });
  }

  initializeEntities() {
    this.entityService.fetch();
    this.snackbarService.messageSubject.subscribe(snack => {
        this.openSnackBar(snack[0], snack[1]);
      }
    );
  }

  initializeIcons() {
    const ICON_ROOT_DIR = 'assets/material-design-icons';
    // const VARIANT_DESIGN = 'design';
    const VARIANT_PRODUCTION = 'production';
    const VARIANT = VARIANT_PRODUCTION;

    class Icon {
      topic: string;
      name: string;
      file: string;

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
    const EDITOR = 'editor';
    const FILE = 'file';
    const IMAGE = 'image';
    const MAPS = 'maps';
    const NAVIGATION = 'navigation';
    const SOCIAL = 'social';

    const icons: Icon[] = [];
    icons.push(new Icon(ACTION, 'agenda', 'ic_view_agenda_24px.svg'));
    icons.push(new Icon(ACTION, 'bug_report', 'ic_bug_report_24px.svg'));
    icons.push(new Icon(ACTION, 'check_circle', 'ic_check_circle_24px.svg'));
    icons.push(new Icon(ACTION, 'code', 'ic_code_24px.svg'));
    icons.push(new Icon(ACTION, 'label_outline', 'ic_label_outline_24px.svg'));
    icons.push(new Icon(ACTION, 'lightbulb_outline', 'ic_lightbulb_outline_24px.svg'));
    icons.push(new Icon(ACTION, 'receipt', 'ic_receipt_24px.svg'));
    icons.push(new Icon(ACTION, 'today', 'ic_today_24px.svg'));
    icons.push(new Icon(ACTION, 'turned_in_not', 'ic_turned_in_not_24px.svg'));
    icons.push(new Icon(ALERT, 'warning', 'ic_warning_24px.svg'));
    icons.push(new Icon(AV, 'play_circle_filled', 'ic_play_circle_filled_24px.svg'));
    icons.push(new Icon(AV, 'replay', 'ic_replay_24px.svg'));
    icons.push(new Icon(COMMUNICATION, 'call', 'ic_call_24px.svg'));
    icons.push(new Icon(COMMUNICATION, 'chat', 'ic_chat_24px.svg'));
    icons.push(new Icon(CONTENT, 'add', 'ic_add_24px.svg'));
    icons.push(new Icon(CONTENT, 'flag', 'ic_flag_24px.svg'));
    icons.push(new Icon(CONTENT, 'mail', 'ic_mail_24px.svg'));
    icons.push(new Icon(CONTENT, 'people_18', 'ic_people_18px.svg'));
    icons.push(new Icon(CONTENT, 'reply', 'ic_reply_24px.svg'));
    icons.push(new Icon(EDITOR, 'delete', 'ic_delete_24px.svg'));
    icons.push(new Icon(EDITOR, 'mode_edit', 'ic_mode_edit_24px.svg'));
    icons.push(new Icon(EDITOR, 'mode_edit_18', 'ic_mode_edit_18px.svg'));
    icons.push(new Icon(EDITOR, 'short_text', 'ic_short_text_24px.svg'));
    icons.push(new Icon(FILE, 'file_download', 'ic_file_download_24px.svg'));
    icons.push(new Icon(FILE, 'file_upload', 'ic_file_upload_24px.svg'));
    icons.push(new Icon(IMAGE, 'timer', 'ic_timer_24px.svg'));
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
