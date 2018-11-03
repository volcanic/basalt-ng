import {SettingType} from './setting-type.enum';
import {FeatureType} from './feature-type.enum';

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

  constructor(type: FeatureType, icon: string, iconColor: string, backgroundColor: string, setting: SettingType) {
    this.type = type;
    this.icon = icon;
    this.iconColor = iconColor;
    this.backgroundColor = backgroundColor;
    this.settingType = setting;
  }
}
