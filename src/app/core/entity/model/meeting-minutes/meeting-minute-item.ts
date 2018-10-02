/**
 * Represents a meeting minute action item
 */
import {Person} from '../person.model';
import {MeetingMinuteItemType} from './meeting-minute-item-type.enum';

export class MeetingMinuteItem {

  /** Type of meeting minute */
  type: MeetingMinuteItemType;
  /** Topic */
  topic: string;
  /** Person associated with this meeting minute item */
  person: Person;
  /** Due date */
  dueDate: Date;
}
