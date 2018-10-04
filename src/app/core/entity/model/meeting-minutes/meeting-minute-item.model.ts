import {Person} from '../person.model';
import {MeetingMinuteItemType} from './meeting-minute-item-type.enum';

/**
 * Represents a meeting minute action item
 */
export class MeetingMinuteItem {

  /** Date */
  date: Date;
  /** Type of meeting minute */
  type: MeetingMinuteItemType;
  /** Statement */
  statement: string;
  /** Person associated with this meeting minute item */
  person: Person;
  /** Due date */
  dueDate: Date;
}
