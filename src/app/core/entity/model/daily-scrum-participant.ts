import {Person} from './person.model';
import {DailyScrumActivity} from './daily-scrum-activity';

/**
 * Represents a scrum participant
 */
export class DailyScrumParticipant {

  /** Person to be displayed */
  person: Person;
  /** Array of daily scrum activities */
  activities: DailyScrumActivity[];

  /**
   * Constructor
   */
  constructor() {
    this.person = new Person('', true);
    this.activities = [];
  }
}
