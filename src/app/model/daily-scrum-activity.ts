import {DAILY_SCRUM_ACTIVITY_TYPE} from './daily-scrum-activity-type.enum';

export class DailyScrumActivity {
  type = DAILY_SCRUM_ACTIVITY_TYPE.UNSPECIFIED;
  topic = '';
  description = '';
}
