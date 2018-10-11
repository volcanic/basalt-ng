import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MeetingMinuteItem} from '../../../../../core/entity/model/meeting-minutes/meeting-minute-item.model';
import {MeetingMinuteItemType} from '../../../../../core/entity/model/meeting-minutes/meeting-minute-item-type.enum';
import {Person} from '../../../../../core/entity/model/person.model';
import {ColorService} from '../../../../../core/ui/services/color.service';
import {MaterialColorService} from '../../../../../core/ui/services/material-color.service';

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

  /** Meeting minute item */
  @Input() meetingMinuteItem: MeetingMinuteItem;
  /** Color of information button */
  @Input() colorInformation = 'transparent';
  /** Color of decision button */
  @Input() colorDecision = 'transparent';

  /** Event emitter indicating changes in meeting minute item type */
  @Output() meetingMinuteItemTypeSelectedEmitter = new EventEmitter<string>();
  /** Event emitter indicating changes in meeting minute item */
  @Output() meetingMinuteItemChangedEmitter = new EventEmitter<MeetingMinuteItem>();
  /** Event emitter indicating deletion of meeting minute item */
  @Output() meetingMinuteItemDeletedEmitter = new EventEmitter<MeetingMinuteItem>();

  /** Background color */
  color: string;
  /** Text color */
  textColor: string;
  /** Alignment */
  alignment: 'left' | 'right' = 'left';

  /** Enum of meeting minute types */
  meetingMinuteItemTypes = Object.keys(MeetingMinuteItemType).map(key => MeetingMinuteItemType[key]);

  /** Enum for meeting minute item types */
  meetingMinuteItemType = MeetingMinuteItemType;

  /**
   * Constructor
   * @param colorService color service
   * @param materialColorService material color service
   */
  constructor(private colorService: ColorService, private materialColorService: MaterialColorService) {
  }

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
  // Initialization
  //

  /**
   * Initializes the color picked by a hash value generated from a name
   */
  private initializeColor() {
    if (this.meetingMinuteItem.type === MeetingMinuteItemType.INFORMATION) {
      this.color = this.colorInformation;
    } else if (this.meetingMinuteItem.type === MeetingMinuteItemType.DECISION) {
      this.color = this.colorDecision;
    } else if (this.meetingMinuteItem.type === MeetingMinuteItemType.ACTION && this.meetingMinuteItem.person != null) {
      this.color = this.colorService.getPersonColor(this.meetingMinuteItem.person);
      this.textColor = this.colorService.getPersonContrast(this.meetingMinuteItem.person);
    }
  }

  /**
   * Initializes alignment
   */
  private initializeAlignment() {
    // this.alignment = this.meetingMinuteItem.person != null ? 'right' : 'left';
    this.alignment = 'left';
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
   * Handles change of a meeting minute item statement
   * @param statement statement
   */
  onMeetingMinuteItemStatementChanged(statement: string) {
    this.meetingMinuteItem.statement = statement;
    this.meetingMinuteItemChangedEmitter.emit(this.meetingMinuteItem);
  }

  /**
   * Handles activation of due date
   */
  onDueDateActivated() {
    this.meetingMinuteItem.dueDate = new Date();
  }

  /**
   * Handles change of a meeting minute item due date
   * @param dueDate due date
   */
  onDueDateChanged(dueDate: Date) {
    this.meetingMinuteItem.dueDate = dueDate;
    this.meetingMinuteItemChangedEmitter.emit(this.meetingMinuteItem);
  }

  /**
   * Handles deletion of a meeting minute item
   * @param meetingMinuteItem meeting minute item
   */
  onMeetingMinuteItemDeleted(meetingMinuteItem: MeetingMinuteItem) {
    this.meetingMinuteItemDeletedEmitter.emit(meetingMinuteItem);
  }
}
