import {Person} from '../person.model';
import {DailyScrumItemType} from './daily-scrum-item-type.enum';

/**
 * Represents a daily scrum item
 */
export class DailyScrumItem {

  /** Date */
  date: Date;
  /** Person associated with this daily scrum item */
  person: Person;
  /** Type of daily scrum item */
  type: DailyScrumItemType;
  /** Statement */
  statement: string;
}
