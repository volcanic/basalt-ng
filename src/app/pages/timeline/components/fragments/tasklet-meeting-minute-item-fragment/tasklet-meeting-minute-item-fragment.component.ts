import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MeetingMinuteItem} from '../../../../../core/entity/model/meeting-minutes/meeting-minute-item.model';
import {MeetingMinuteItemType} from '../../../../../core/entity/model/meeting-minutes/meeting-minute-item-type.enum';

/**
 * Displays meeting minute item fragment
 */
@Component({
  selector: 'app-tasklet-meeting-minute-item-fragment',
  templateUrl: './tasklet-meeting-minute-item-fragment.component.html',
  styleUrls: ['./tasklet-meeting-minute-item-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskletMeetingMinuteItemFragmentComponent implements OnInit {

  /** Meeting minute item to display */
  @Input() meetingMinuteItem: MeetingMinuteItem;

  /** Icon name */
  icon = '';
  /** List of meeting minute item statement parts */
  meetingMinuteItemStatementParts: string[];

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeIcon();
    this.initializeMeetingMinuteItemStatementParts();
  }

  //
  // Initialization
  //

  /**
   * Initializes icon
   */
  private initializeIcon() {
    switch (this.meetingMinuteItem.type) {
      case MeetingMinuteItemType.INFORMATION: {
        this.icon = 'comment';
        break;
      }
      case MeetingMinuteItemType.DECISION: {
        this.icon = 'gavel';
        break;
      }
      case MeetingMinuteItemType.ACTION: {
        this.icon = 'person';
        break;
      }
    }
  }

  /**
   * Initializes meeting minute item statement parts
   */
  private initializeMeetingMinuteItemStatementParts() {
    this.meetingMinuteItemStatementParts = this.meetingMinuteItem.statement.split('\n').map(p => {
      return p.trim();
    });
  }
}
