import {Person} from '../person.model';
import {DailyScrumActivity} from './daily-scrum-activity';

export class DailyScrumParticipant {
  person: Person;
  activities: DailyScrumActivity[];

  constructor() {
    this.person = new Person('', true);
    this.activities = [];
  }
}
