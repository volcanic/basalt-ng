import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MeetingMinuteItem} from '../../../../../core/entity/model/meeting-minutes/meeting-minute-item.model';
import {MeetingMinuteItemType} from '../../../../../core/entity/model/meeting-minutes/meeting-minute-item-type.enum';
import {Person} from '../../../../../core/entity/model/person.model';
import {Hash} from '../../../../../core/entity/model/hash';

/**
 * Displays meeting minute item
 */
@Component({
  selector: 'app-meeting-minutes-item-fragment',
  templateUrl: './meeting-minute-item-fragment.component.html',
  styleUrls: ['./meeting-minute-item-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingMinuteItemFragmentComponent implements OnInit {

  /** Array of available project colors */
  static colors = [
    '#C8E6C9', // Green 100
    '#A5D6A7', // Green 200
    '#81C784', // Green 300
    '#DCEDC8', // Light green 100
    '#C5E1A5', // Light green 200
    '#AED581', // Light green 300
    '#F0F4C3', // Lime 100
    '#E6EE9C', // Lime 200
    '#DCE775' // Lime 300
  ];

  /** Meeting minute item */
  @Input() meetingMinuteItem: MeetingMinuteItem;
  /** Event emitter indicating changes in meeting minute item type */
  @Output() meetingMinuteItemTypeSelectedEmitter = new EventEmitter<string>();
  /** Event emitter indicating deletion of meeting minute item */
  @Output() meetingMinuteItemDeletedEmitter = new EventEmitter<MeetingMinuteItem>();

  /** Background color */
  color: string;
  /** Alignment */
  alignment: string;

  /** Enum of meeting minute types */
  meetingMinuteItemTypes = Object.keys(MeetingMinuteItemType).map(key => MeetingMinuteItemType[key]);

  /** Enum for meeting minute item types */
  meetingMinuteItemType = MeetingMinuteItemType;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeColor();
    this.initializeAlignment();
  }

  //
  // Actions
  //

  /**
   * Handles type changes
   * @param {Person} type new type
   */
  onMeetingMinuteItemTypeChanged(type: MeetingMinuteItemType) {
    this.meetingMinuteItem.type = type;
    this.meetingMinuteItemTypeSelectedEmitter.emit('');
  }

  /**
   * Handles deletion of a meeting minute item
   * @param meetingMinuteItem meeting minute item
   */
  onMeetingMinuteItemDeleted(meetingMinuteItem: MeetingMinuteItem) {
    this.meetingMinuteItemDeletedEmitter.emit(meetingMinuteItem);
  }

  //
  // Helpers
  //

  /**
   * Initializes the color picked by a hash value generated from a name
   */
  private initializeColor() {
    if (this.meetingMinuteItem.person != null) {
      if (this.meetingMinuteItem.person.name != null && this.meetingMinuteItem.person.name.trim().length > 0) {
        this.color = MeetingMinuteItemFragmentComponent.colors[
        Math.abs(Hash.hash(this.meetingMinuteItem.person.name.toLowerCase().replace(
          ' ', ''))) % MeetingMinuteItemFragmentComponent.colors.length];
      } else {
        this.color = 'transparent';
      }
    } else {
      this.color = '#eceff1';
    }
  }

  /**
   * Initializes alignment
   */
  private initializeAlignment() {
    this.alignment = this.meetingMinuteItem.person != null ? 'right' : 'left';
  }
}
