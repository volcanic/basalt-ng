import {Injectable} from '@angular/core';
import {Feature} from '../model/feature.model';
import {FeatureType} from '../model/feature-type.enum';
import {ColorService} from '../../ui/services/color.service';
import {SettingType} from '../model/setting-type.enum';
import {SettingsService} from './settings.service';
import {Setting} from '../model/setting.model';

/**
 * Handles features
 */
@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  /** List of features */
  features: Feature[];

  /**
   * Constructor
   * @param colorService color service
   * @param settingsService settings service
   */
  constructor(private colorService: ColorService,
              private settingsService: SettingsService) {
    this.initializeFeatures();
  }

  //
  // Initialization
  //

  /**
   * Initializes features
   */
  private initializeFeatures() {
    this.features = [];

    const featureTypes = Object.keys(FeatureType).map(key => FeatureType[key]);

    featureTypes.forEach(type => {
      const iconColor = this.colorService.getFeatureTypeColor(type).contrast;
      const backgroundColor = this.colorService.getFeatureTypeColor(type).color;

      switch (type) {
        case FeatureType.DEVELOPMENT: {
          this.features.push(new Feature(type, 'code', iconColor, backgroundColor, SettingType.DEVELOPMENT));
          break;
        }
        case FeatureType.SCRUM: {
          this.features.push(new Feature(type, 'scrum', iconColor, backgroundColor, SettingType.SCRUM));
          break;
        }
        case FeatureType.POMODORO: {
          this.features.push(new Feature(type, 'circle_slice_3', iconColor, backgroundColor, SettingType.POMODORO));
          break;
        }
      }
    });
  }

  /**
   * Determines if a feature is active
   * @param featureType feature type
   * @param settings map of settings
   */
  public isFeatureActive(featureType: FeatureType, settings: Map<string, Setting>): boolean {
    return this.features.filter(feature => {
      return feature.type === featureType;
    }).some(feature => {
      const settingType = feature.settingType;
      return settings != null
        && settings.get(settingType) != null
        && settings.get(settingType).value === true;
    });
  }
}
