import {Person} from '../person.model';
import {MeetingMinuteItemType} from './meeting-minute-item-type.enum';

/**
 * Represents a meeting minute item
 */
export class MeetingMinuteItem {

  /** Date */
  date: Date;
  /** Type of meeting minute */
  type: MeetingMinuteItemType;
  /** Topic */
  topic: string;
  /** Statement */
  statement: string;
  /** Person associated with this meeting minute item */
  person: Person;
  /** Due date */
  dueDate: Date;
}
