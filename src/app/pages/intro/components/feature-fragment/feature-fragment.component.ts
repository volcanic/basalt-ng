import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {FeatureType} from '../../../../core/settings/model/feature-type.enum';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {ColorService} from '../../../../core/ui/services/color.service';
import {FeatureService} from '../../../../core/settings/services/feature.service';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {Setting} from '../../../../core/settings/model/setting.model';

/**
 * Represents a feature action button
 */
class FeatureAction {
  /** Feature type */
  featureType: FeatureType;
  /** Setting type */
  settingType: SettingType;
  /** Active */
  active = false;
  /** Label to be displayed */
  label: string;
  /** Icon to be used */
  icon: string;
  /** Background color to be used */
  backgroundColor: string;
  /** Background color to be used */
  iconColor: string;
}

/**
 * Displays feature fragment
 */
@Component({
  selector: 'app-feature-fragment',
  templateUrl: './feature-fragment.component.html',
  styleUrls: ['./feature-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureFragmentComponent implements OnInit, OnChanges {

  /** Map of current settings */
  @Input() settings = new Map<string, Setting>();
  /** Event emitter indicating tasklet type selection */
  @Output() featureToggledEmitter = new EventEmitter<{ type: SettingType, value: any }>();

  /** List of tasklet type actions */
  featureActions: FeatureAction[] = [];
  /** Currently hovered feature */
  hoveredFeature: FeatureType;

  /**
   * Constructor
   * @param colorService color service
   * @param featureService feature service
   * @param settingsService settings service
   */
  constructor(private colorService: ColorService,
              private featureService: FeatureService,
              private settingsService: SettingsService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeFeatures();
  }

  /**
   * Handles on-changes lifecycle phase
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initializeFeatures();
    this.updateActionActive();
    this.updateActionColor();
  }

  //
  // Initialization
  //

  /**
   * Initializes tasklet types
   */
  initializeFeatures() {
    this.featureActions = [];
    if (this.featureService.features != null) {
      this.featureService.features.forEach(feature => {
        const action = new FeatureAction();
        action.featureType = feature.type;
        action.settingType = feature.settingType;
        action.backgroundColor = this.getFeatureColor(action.featureType, this.featureService.isFeatureActive(feature.type, this.settings));
        action.iconColor = this.getFeatureContrast(action.featureType, this.featureService.isFeatureActive(feature.type, this.settings));
        action.icon = feature.icon;
        action.label = feature.type.toString();
        this.featureActions.push(action);
      });
    }
  }

  //
  // Actions
  //

  /**
   * Handles selection of a feature
   * @param action feature action
   */
  onFeatureToggled(action: FeatureAction) {
    this.featureToggledEmitter.emit({type: action.settingType, value: !action.active});
  }

  /**
   * Handles hover over container
   * @param hovered whether there is currently a hover event
   * @param action tasklet type group action
   */
  onHoverContainer(hovered: boolean, action: FeatureAction) {
    this.hoveredFeature = hovered ? action.featureType : null;
    this.updateActionColor();
  }

  //
  // Helpers
  //

  /**
   * Updates active status
   */
  private updateActionActive() {
    this.featureActions.forEach((action: FeatureAction) => {
      const setting = this.settings.get(action.settingType);
      action.active = setting != null && JSON.parse(setting.value) === true;
    });
  }

  /**
   * Updates colors
   */
  private updateActionColor() {
    this.featureActions.forEach((action: FeatureAction) => {
      action.backgroundColor = this.getFeatureColor(action.featureType, action.active);
      action.iconColor = this.getFeatureContrast(action.featureType, action.active);
    });
  }

  /**
   * Retrieves a color by feature and current settingType
   * @param feature feature
   * @param active active
   */
  private getFeatureColor(feature: FeatureType, active: boolean): string {
    if (active || this.hoveredFeature === feature) {
      return this.colorService.getFeatureTypeColor(feature).color;
    } else {
      return this.colorService.getFeatureTypeColor(null).color;
    }
  }

  /**
   * Retrieves a contrast by feature and current settingType
   * @param feature feature
   * @param active active
   */
  private getFeatureContrast(feature: FeatureType, active: boolean): string {
    if (active || this.hoveredFeature === feature) {
      return this.colorService.getFeatureTypeColor(feature).contrast;
    } else {
      return this.colorService.getFeatureTypeColor(null).contrast;
    }
  }
}
