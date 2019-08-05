import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {Setting} from '../../../../core/settings/model/setting.model';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {environment} from '../../../../../environments/environment';
import {NewFeaturesDialogComponent} from '../../../../ui/new-features-dialog/new-features-dialog/new-features-dialog.component';
import {GitTag} from '../../../../core/settings/model/git-tag.model';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {filter, takeUntil} from 'rxjs/operators';
import {Media} from '../../../../core/ui/model/media.enum';
import {MediaService} from '../../../../core/ui/services/media.service';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {Observable, Subject} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {FeatureService} from '../../../../core/settings/services/feature.service';
import {Settings} from 'http2';

/**
 * Displays an intro page
 */
@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit, OnDestroy {

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** Enum of media types */
  public mediaType = Media;
  /** Current media */
  public media: Media = Media.UNDEFINED;

  /** Map of current settings */
  settingsMap = new Map<string, Setting>();

  /** Whether to display feature selection step or not */
  private displayFeatureSelection = false;

  /**
   * Constructor
   * @param featureService feature service
   * @param mediaService media service
   * @param materialColorService material color service
   * @param materialIconService material icon service
   * @param settingsService settings service
   * @param router router
   * @param dialog dialog
   * @param iconRegistry icon registry
   * @param sanitizer dom sanitizer
   */
  constructor(private featureService: FeatureService,
              private mediaService: MediaService,
              private materialColorService: MaterialColorService,
              private materialIconService: MaterialIconService,
              private settingsService: SettingsService,
              private router: Router,
              public dialog: MatDialog,
              private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {
  }

  //
  // Initialization
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeSubscriptions();
    this.initializeFeatures();

    this.initializeOptionalSteps();
    this.initializeMaterial();

    this.findSettings();
  }

  /**
   * Handles on-destroy lifecycle phase
   */
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Events
  //

  /**
   * Handles setting updates
   * @param settings settings
   */
  onSettingsUpdated(settings: Map<string, Setting>) {
    this.initializeSettings(settings);
  }

  /**
   * Handles media updates
   * @param media media
   */
  onMediaUpdated(media: Media) {
    this.media = media as Media;
  }

  //
  // Initialization
  //

  /**
   * Initialize subscriptions
   */
  private initializeSubscriptions() {
    this.initializeSettingsSubscription().subscribe(value => {
      this.onSettingsUpdated(value as Map<string, Setting>);
    });
    this.initializeMediaSubscription().subscribe(value => {
      this.onMediaUpdated(value as Media);
    });
  }

  /**
   * Initializes features
   */
  private initializeFeatures() {
    this.settingsService.updateSetting(new Setting(SettingType.ONBOARDING_DONE, false));
    this.settingsService.updateSetting(new Setting(SettingType.DEVELOPMENT, false));
    this.settingsService.updateSetting(new Setting(SettingType.SCRUM, false));
    this.settingsService.updateSetting(new Setting(SettingType.POMODORO, false));
    this.settingsService.updateSetting(new Setting(SettingType.POMODORO_DURATION, 25));
    this.settingsService.updateSetting(new Setting(SettingType.POMODORO_BREAK, 5));
  }

  /**
   * Initializes settings subscription
   */
  protected initializeSettingsSubscription(): Observable<Map<string, Setting>> {
    return this.settingsService.settingsSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  /**
   * Initializes media subscription
   */
  protected initializeMediaSubscription(): Observable<Media> {
    return this.mediaService.mediaSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  /**
   * Initialize settings
   * @param settings settings
   */
  private initializeSettings(settings: Map<string, Setting>) {
    this.settingsMap = new Map(settings);
  }

  /**
   * Initializes material colors and icons
   */
  private initializeMaterial() {
    this.materialColorService.initializeColors();
    this.materialIconService.initializeIcons(this.iconRegistry, this.sanitizer);
  }

  /**
   * Initializes an unset settingType
   * @param settingType setting type
   * @param value value
   */
  private initializeSetting(settingType: SettingType, value: any) {
    if (this.settingsMap.get(settingType) == null) {
      const setting = new Setting(settingType, value);
      this.settingsService.updateSetting(setting);
    }
  }

  /**
   * Initializes optional steps
   */
  private initializeOptionalSteps() {
    this.displayFeatureSelection = this.featureService.features.some(feature => {
      return (this.settingsMap.get(feature.settingType) == null);
    });
  }

  //
  // Actions
  //

  /**
   * Handles feature toggle
   * @param event event
   */
  onFeatureToggled(event: { type: SettingType, value: any }) {
    const setting = new Setting(event.type, event.value);
    this.settingsService.updateSetting(setting);
  }

  /**
   * Handles click on continue button
   */
  onContinue() {
    const setting = new Setting(SettingType.ONBOARDING_DONE, true);
    this.settingsService.updateSetting(new Setting(SettingType.ONBOARDING_DONE, true));
    this.router.navigate([`/timeline`]).then(() => {
    });
  }

  //
  //
  //

  /**
   * Triggers settings retrieval from database
   */
  protected findSettings() {
    this.settingsService.fetch();
  }

  //
  // Helpers
  //

  /**
   * Handles display of new features dialog
   * @param currentVersion current version
   */
  private showNewFeatures(currentVersion: string) {
    // Current version
    // tslint:disable-next-line:radix
    const currentMajor = Number.parseInt(environment.VERSION.split('.')[0]);
    // tslint:disable-next-line:radix
    const currentMinor = Number.parseInt(environment.VERSION.split('.')[1]);
    // tslint:disable-next-line:radix
    const currentPatch = Number.parseInt(environment.VERSION.split('.')[2]);

    // Latest version
    // tslint:disable-next-line:radix
    const latestMajor = Number.parseInt(currentVersion.split('.')[0]);
    // tslint:disable-next-line:radix
    const latestMinor = Number.parseInt(currentVersion.split('.')[1]);
    // tslint:disable-next-line:radix
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
            // tslint:disable-next-line:radix
            const tagMajor = Number.parseInt(gt.annotation.split('.')[0]);
            // tslint:disable-next-line:radix
            const tagMinor = Number.parseInt(gt.annotation.split('.')[1]);
            // tslint:disable-next-line:radix
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
        this.settingsService.updateSetting(new Setting(SettingType.VERSION, environment.VERSION));
      });
    }
  }
}
