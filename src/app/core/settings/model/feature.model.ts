import {SettingType} from './setting-type.enum';
import {FeatureType} from './feature-type.enum';

/**
 * Represents a feature
 */
export class Feature {

  /** Feature type */
  type: FeatureType;
  /** Icon */
  icon: string;
  /** Icon color */
  iconColor: string;
  /** Background color */
  backgroundColor: string;
  /** Setting associated with this feature */
  settingType: SettingType;

  /**
   * Constructor
   * @param type type
   * @param icon icon
   * @param iconColor icon color
   * @param backgroundColor background color
   * @param settingType setting type
   */
  constructor(type: FeatureType, icon: string, iconColor: string, backgroundColor: string, settingType: SettingType) {
    this.type = type;
    this.icon = icon;
    this.iconColor = iconColor;
    this.backgroundColor = backgroundColor;
    this.settingType = settingType;
  }
}
