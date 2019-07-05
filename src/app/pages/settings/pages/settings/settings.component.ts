import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Media} from '../../../../core/ui/model/media.enum';
import {map} from 'rxjs/internal/operators';
import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/scrolling';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {Subject} from 'rxjs';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {Setting} from '../../../../core/settings/model/setting.model';
import {Router} from '@angular/router';
import {Animations, ScrollDirection, ScrollState} from './settings.animation';

/**
 * Displays settings page
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [
    Animations.toolbarAnimation,
    Animations.fabAnimation,
    Animations.dateIndicatorAnimation,
  ]
})
export class SettingsComponent implements OnInit, AfterViewInit, OnDestroy {

  /** App title */
  title = 'Settings';

  /** Map of current settings */
  settings = new Map<string, Setting>();

  /** Feature development */
  development: boolean;
  /** Feature scrum */
  scrum: boolean;
  /** Feature pomodoro */
  pomodoro: boolean;
  /** Setting pomodoro duration */
  pomodoroDuration: number;
  /** Setting pomodoro break */
  pomodoroBreak: number;

  /** Search items options for auto-complete */
  public searchOptions = [];

  /** Enum of media types */
  public mediaType = Media;
  /** Current media */
  public media: Media = Media.UNDEFINED;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** Vertical scroll position */
  private scrollPosLast = 0;
  /** Scroll direction */
  public scrollDirection: ScrollDirection = ScrollDirection.UP;
  /** Scroll state */
  public scrollState: ScrollState = ScrollState.NON_SCROLLING;

  /** Enum of setting types */
  settingsType = SettingType;

  /** Scrollable directive */
  @ViewChild(CdkScrollable, {static: false}) scrollable: CdkScrollable;

  /**
   * Constructor
   * @param iconRegistry icon registry
   * @param materialColorService material color service
   * @param materialIconService material icon service
   * @param router router
   * @param sanitizer dom sanitizer
   * @param scroll scrol dispatcher
   * @param settingsService settings service
   * @param zone ng zone
   */
  constructor(private iconRegistry: MatIconRegistry,
              private materialColorService: MaterialColorService,
              private materialIconService: MaterialIconService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private scroll: ScrollDispatcher,
              public settingsService: SettingsService,
              public zone: NgZone) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeMaterial();
    this.initializeScrollDetection();
    this.initializeSettings();
  }

  /**
   * Handles after-view-init lifecycle phase
   */
  ngAfterViewInit() {
    this.initializeScrollDetection();
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
   * Initializes material colors and icons
   */
  private initializeMaterial() {
    this.materialColorService.initializeColors();
    this.materialIconService.initializeIcons(this.iconRegistry, this.sanitizer);
  }

  /**
   * Initializes settings
   */
  private initializeSettings() {
    this.settingsService.fetch();
    this.settingsService.settingsSubject.subscribe(value => {
      if (value != null) {
        this.settings = value;
        this.development = JSON.parse(this.settings.get(SettingType.DEVELOPMENT).value);
        this.scrum = JSON.parse(this.settings.get(SettingType.SCRUM).value);
        this.pomodoro = JSON.parse(this.settings.get(SettingType.POMODORO).value);
        this.pomodoroDuration = +this.settings.get(SettingType.POMODORO_DURATION).value;
        this.pomodoroBreak = +this.settings.get(SettingType.POMODORO_BREAK).value;
      }
    });
  }

  /**
   * Initializes scroll detection
   */
  private initializeScrollDetection() {
    let scrollTimeout = null;

    if (this.scroll != null && this.scroll.scrolled != null) {
      this.scroll.scrolled(0)
        .pipe(map(() => {
          // Update scroll state
          this.scrollState = ScrollState.SCROLLING;
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            this.scrollState = ScrollState.NON_SCROLLING;
          }, 500);

          // Update scroll direction
          const scrollPos = this.scrollable.getElementRef().nativeElement.scrollTop;
          if (this.scrollDirection === ScrollDirection.UP && scrollPos > this.scrollPosLast) {
            this.scrollDirection = ScrollDirection.DOWN;
            // Since scroll is run outside Angular zone change detection must be triggered manually
            this.zone.run(() => {
            });
          } else if (this.scrollDirection === ScrollDirection.DOWN && scrollPos < this.scrollPosLast) {
            this.scrollDirection = ScrollDirection.UP;
            // Since scroll is run outside Angular zone change detection must be triggered manually
            this.zone.run(() => {
            });
          }

          // Save current scroll position
          this.scrollPosLast = scrollPos;
        })).subscribe();
    }
  }

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'back': {
        this.router.navigate(['/timeline']).then(() => {
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Handles search item typed into the search field
   * @param searchItem new search item
   */
  onSearchItemChanged(searchItem: string) {
  }

  /**
   * Handles toggle of a setting
   * @param settingName name of the setting that has been toggled
   * @param value new value
   */
  onSettingToggled(settingName: string, value: any) {
    const setting = new Setting(settingName, value);
    this.settingsService.updateSetting(setting);
  }

  /**
   * Handles value changes
   * @param settingName name of the setting to get a new value
   * @param value new value
   */
  onValueChanged(settingName: string, value: any) {
    if (value != null) {
      const setting = new Setting(settingName, value);
      this.settingsService.updateSetting(setting);
    }
  }
}
