import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Tasklet} from '../../../../../core/entity/model/tasklet.model';
import {MeetingMinuteItemType} from '../../../../../core/entity/model/meeting-minutes/meeting-minute-item-type.enum';
import {MeetingMinuteItem} from '../../../../../core/entity/model/meeting-minutes/meeting-minute-item.model';

/**
 * Displays meeting minute fragment
 */
@Component({
  selector: 'app-tasklet-meeting-minutes-fragment',
  templateUrl: './tasklet-meeting-minutes-fragment.component.html',
  styleUrls: ['./tasklet-meeting-minutes-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskletMeetingMinutesFragmentComponent implements OnInit {

  /** Name of default topic */
  static TOPIC_GENERAL = 'General';

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;

  /** Topic */
  topics: string[] = [];

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeTopics();
  }

  /**
   * Initializes topic
   */
  private initializeTopics() {
    const topicsMap = new Map<string, string>();

    if (this.tasklet != null && this.tasklet.meetingMinuteItems != null) {
      this.tasklet.meetingMinuteItems.forEach(m => {
        const topic = (m.type !== MeetingMinuteItemType.TOPIC && m.topic != null)
          ? m.topic : TaskletMeetingMinutesFragmentComponent.TOPIC_GENERAL;
        topicsMap.set(topic, topic);
      });

      this.topics = Array.from(topicsMap.values());
    }
  }

  /**
   * Returns list of meeting minutes by topic
   * @param topic topic
   */
  public getMeetingMinuteItemsByTopic(topic: string): MeetingMinuteItem[] {
    return this.tasklet.meetingMinuteItems.filter(m => {
      return (m.topic === topic
        || (m.topic === null && topic === TaskletMeetingMinutesFragmentComponent.TOPIC_GENERAL));
    }).sort((m1, m2) => {
      return new Date(m2.date).getTime() < new Date(m1.date).getTime() ? 1 : -1;
    }).sort((a, b) => {
      if (a.type < b.type) {
        return 1;
      }
      if (a.type > b.type) {
        return -1;
      }
      return 0;
    });
  }
}
