import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {Setting} from '../../../../core/settings/model/setting.model';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {environment} from '../../../../../environments/environment';
import {NewFeaturesDialogComponent} from '../../../../ui/new-features-dialog/new-features-dialog/new-features-dialog.component';
import {GitTag} from '../../../../core/settings/model/git-tag.model';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {takeUntil} from 'rxjs/operators';
import {Media} from '../../../../core/ui/model/media.enum';
import {MediaService} from '../../../../core/ui/services/media.service';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {Subject} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {FeatureService} from '../../../../core/settings/services/feature.service';

/**
 * Displays an intro page
 */
@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit, OnDestroy {

  /** Title to be displayed */
  title = 'How do you work?';
  /** Description to be displayed */
  description = 'Select the aspects you want to use (you can change this later)';

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** Enum of media types */
  public mediaType = Media;
  /** Current media */
  public media: Media = Media.UNDEFINED;

  /** Map of current settings */
  settings = new Map<string, Setting>();

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
    this.initializeSettings();
    this.initializeSemaphore();
    this.initializeMaterial();
    this.initializeMediaSubscription();
  }

  /**
   * Handles on-destroy lifecycle phase
   */
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Initialization
  //

  /**
   * Initializes an unset settingType
   * @param settings settingType
   * @param value value
   */
  private initializeSetting(settings: SettingType, value: any) {
    if (this.settingsService.settings.get(settings) == null) {
      const setting = new Setting(settings, value);
      this.settingsService.updateSetting(setting);
    }
  }

  /**
   * Initializes semaphore
   */
  private initializeSemaphore() {
    // Activate semaphore
    this.settingsService.updateSetting(new Setting(SettingType.SEMAPHORE_FEATURE, true));
  }

  /**
   * Initializes settings
   */
  private initializeSettings() {
    this.settingsService.fetch();
    this.settingsService.settingsSubject.subscribe(value => {
      if (value != null) {
        this.settings = new Map(value);

        // Initialize version setting
        if (this.settings.get(SettingType.VERSION) != null) {
          this.showNewFeatures(this.settings.get(SettingType.VERSION).value);
        }
      }
    });
  }

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

  /**
   * Initializes material colors and icons
   */
  private initializeMaterial() {
    this.materialColorService.initializeColors();
    this.materialIconService.initializeIcons(this.iconRegistry, this.sanitizer);
  }

  /**
   * Initializes media subscription
   */
  private initializeMediaSubscription() {
    this.media = this.mediaService.media;
    this.mediaService.mediaSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.media = value as Media;
    });
  }

  //
  // Actions
  //

  /**
   * Handles click on continue button
   */
  onContinue() {
    // Set default values
    this.initializeSetting(SettingType.DEVELOPMENT, false);
    this.initializeSetting(SettingType.SCRUM, false);
    this.initializeSetting(SettingType.POMODORO, false);
    this.initializeSetting(SettingType.POMODORO_DURATION, 5);
    this.initializeSetting(SettingType.POMODORO_BREAK, 5);

    // Deactivate semaphore
    this.settingsService.updateSetting(new Setting(SettingType.SEMAPHORE_FEATURE, false));

    this.router.navigate([`/timeline`]).then(() => {
    });
  }
}
