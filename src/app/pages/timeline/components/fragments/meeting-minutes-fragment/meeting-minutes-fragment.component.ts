import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MeetingMinuteItem} from '../../../../../core/entity/model/meeting-minutes/meeting-minute-item.model';
import {MeetingMinuteItemType} from '../../../../../core/entity/model/meeting-minutes/meeting-minute-item-type.enum';
import {Person} from '../../../../../core/entity/model/person.model';

/**
 * Displays meeting minutes
 */
@Component({
  selector: 'app-meeting-minutes-fragment',
  templateUrl: './meeting-minutes-fragment.component.html',
  styleUrls: ['./meeting-minutes-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingMinutesFragmentComponent implements OnInit {

  /** Array of meeting minute items */
  @Input() meetingMinuteItems: MeetingMinuteItem[] = [];
  /** Array of person options */
  @Input() personOptions: string[] = [];
  /** Input text */
  text = '';
  /** Current topic */
  topic = '';

  private SHORTCUT_INFORMATION = 'I';
  private SHORTCUT_DECISION = 'D';
  private SHORTCUT_TOPIC = 'Q';

  tooltipInformation = `Information (CTRL+${this.SHORTCUT_INFORMATION})`;
  tooltipDecision = `Decision (CTRL+${this.SHORTCUT_DECISION})`;
  tooltipTopic = `Topic (CTRL+${this.SHORTCUT_TOPIC})`;

  //
  // Lifecycle hooks
  //


  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeMeetingMinuteItems();
  }

  //
  // Initialization
  //

  /**
   * Initializes meeting minute items
   */
  private initializeMeetingMinuteItems() {
    if (this.meetingMinuteItems == null) {
      this.meetingMinuteItems = [];
    }
  }

  //
  // Actions
  //

  /**
   * Handles key down event
   * @param event
   */
  onKeyDown(event: any) {
    if (event.ctrlKey) {
      const KEY_CODE_ENTER = 13;
      if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
        this.addInformation(this.text);
      } else {
        switch (String.fromCharCode(event.keyCode).toUpperCase()) {
          case this.SHORTCUT_INFORMATION: {
            this.addInformation(this.text);
            break;
          }
          case this.SHORTCUT_DECISION: {
            this.addDecision(this.text);
            break;
          }
          case this.SHORTCUT_TOPIC: {
            this.setTopic(this.text);
            break;
          }
        }
      }
    }
  }

  /**
   * Handles click on information button
   */
  onInformationClicked() {
    this.addInformation(this.text);
  }

  /**
   * Handles click on decision button
   */
  onDecisionClicked() {
    this.addDecision(this.text);
  }

  /**
   * Handles selection of a person
   * @param name name of the selected person
   */
  onPersonSelected(name: string) {
    this.addAction(this.text, new Person(name));
  }

  /**
   * Handles click on topic button
   */
  onTopicClicked() {
    this.setTopic(this.text);
  }

  /**
   * Handles deletion of a meeting minute item
   * @param meetingMinuteItem meeting minute item
   */
  onMeetingMinuteItemDeleted(meetingMinuteItem: MeetingMinuteItem) {
    this.meetingMinuteItems = this.meetingMinuteItems.filter(item => {
      return item.date.toString() !== meetingMinuteItem.date.toString();
    });
  }

  //
  // Helpers
  //

  /**
   * Add a meeting minute of type information
   * @param statement statement
   */
  private addInformation(statement: string) {
    if (statement.trim() !== '') {
      const item = new MeetingMinuteItem();
      item.date = new Date();
      item.type = MeetingMinuteItemType.INFORMATION;
      item.topic = this.topic;
      item.statement = statement;
      this.meetingMinuteItems.push(item);
      this.text = '';
    }
  }

  /**
   * Add a meeting minute of type decision
   * @param statement statement
   */
  private addDecision(statement: string) {
    if (statement.trim() !== '') {
      const item = new MeetingMinuteItem();
      item.date = new Date();
      item.type = MeetingMinuteItemType.DECISION;
      item.topic = this.topic;
      item.statement = statement;
      this.meetingMinuteItems.push(item);
      this.text = '';
    }
  }

  /**
   * Add a meeting minute of type action
   * @param statement statement
   * @param person person
   */
  private addAction(statement: string, person: Person) {
    if (statement.trim() !== '') {
      const item = new MeetingMinuteItem();
      item.date = new Date();
      item.type = MeetingMinuteItemType.ACTION;
      item.topic = this.topic;
      item.statement = statement;
      item.person = person;
      this.meetingMinuteItems.push(item);
      this.text = '';
    }
  }

  /**
   * Sets the topic to a given value
   * @param topic topic
   */
  private setTopic(topic: string) {
    if (topic.trim() !== '') {
      this.topic = topic;

      const item = new MeetingMinuteItem();
      item.date = new Date();
      item.type = MeetingMinuteItemType.TOPIC;
      item.statement = topic;
      this.meetingMinuteItems.push(item);
      this.text = '';
    }
  }
}
