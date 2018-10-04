import {Person} from '../person.model';
import {MeetingMinuteItemType} from './meeting-minute-item-type.enum';

/**
 * Represents a meeting minute action item
 */
export class MeetingMinuteItemModel {

  /** Type of meeting minute */
  type: MeetingMinuteItemType;
  /** Topic */
  topic: string;
  /** Person associated with this meeting minute item */
  person: Person;
  /** Due date */
  dueDate: Date;
}
