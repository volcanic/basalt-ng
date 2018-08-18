import {DailyScrumActivityType} from './daily-scrum-activity-type.enum';

/**
 * Represents an activity done by a scrum participant
 */
export class DailyScrumActivity {

  /** Activity type */
  type = DailyScrumActivityType.UNSPECIFIED;
  /** Activity topic */
  topic = '';
  /** Activity description */
  description = '';
}
