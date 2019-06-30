import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MeetingMinuteItem} from '../../../../../../core/entity/model/meeting-minutes/meeting-minute-item.model';
import {MeetingMinuteItemType} from '../../../../../../core/entity/model/meeting-minutes/meeting-minute-item-type.enum';
import {Person} from '../../../../../../core/entity/model/person.model';
import {ColorService} from '../../../../../../core/ui/services/color.service';
import {MaterialColorService} from '../../../../../../core/ui/services/material-color.service';

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
  /** Additional person option representing the user */
  @Input() myselfOption: string;

  /** Color of information button */
  @Input() colorInformation = 'transparent';
  /** Color of decision button */
  @Input() colorDecision = 'transparent';
  /** Contrast personColor of information button */
  @Input() contrastInformation = 'transparent';
  /** Contrast personColor of decision button */
  @Input() contrastDecision = 'transparent';

  /** Event emitter indicating changes in meeting minute item type */
  @Output() meetingMinuteItemTypeSelectedEmitter = new EventEmitter<string>();
  /** Event emitter indicating changes in meeting minute item */
  @Output() meetingMinuteItemChangedEmitter = new EventEmitter<MeetingMinuteItem>();
  /** Event emitter indicating deletion of meeting minute item */
  @Output() meetingMinuteItemDeletedEmitter = new EventEmitter<MeetingMinuteItem>();

  /** Background personColor */
  color: string;
  /** Text personColor */
  textColor: string;
  /** Alignment */
  alignment: 'left' | 'right' = 'left';

  /** Enum for meeting minute item types */
  meetingMinuteItemType = MeetingMinuteItemType;

  /**
   * Constructor
   * @param colorService personColor service
   * @param materialColorService material personColor service
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
      this.textColor = this.contrastInformation;
    } else if (this.meetingMinuteItem.type === MeetingMinuteItemType.DECISION) {
      this.color = this.colorDecision;
      this.textColor = this.contrastDecision;
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
   * @param type new type
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
