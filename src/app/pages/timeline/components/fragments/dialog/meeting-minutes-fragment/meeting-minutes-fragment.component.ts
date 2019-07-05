import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MeetingMinuteItem} from '../../../../../../core/entity/model/meeting-minutes/meeting-minute-item.model';
import {MeetingMinuteItemType} from '../../../../../../core/entity/model/meeting-minutes/meeting-minute-item-type.enum';
import {Person} from '../../../../../../core/entity/model/person.model';
import {MaterialColorService} from '../../../../../../core/ui/services/material-color.service';
import {PaletteType} from '../../../../../../core/ui/model/palette-type.enum';
import {HueType} from '../../../../../../core/ui/model/hue-type.enum';

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
  /** Additional person option representing the user */
  @Input() myselfOption: string;
  /** Event emitter indicating changes in meeting minute items */
  @Output() meetingMinuteItemsUpdatedEmitter = new EventEmitter<MeetingMinuteItem[]>();

  /** Input text */
  text = '';
  /** Current topic */
  topic = null;

  /** Shortcut button for information */
  private SHORTCUT_INFORMATION = 'I';
  /** Shortcut button for decision */
  private SHORTCUT_DECISION = 'Y';
  /** Shortcut button for topic */
  private SHORTCUT_TOPIC = 'Q';

  /** Tooltip of information button */
  tooltipInformation = `Information (CTRL+${this.SHORTCUT_INFORMATION})`;
  /** Tooltip of decision button */
  tooltipDecision = `Decision (CTRL+${this.SHORTCUT_DECISION})`;
  /** Tooltip of topic button */
  tooltipTopic = `Topic (CTRL+${this.SHORTCUT_TOPIC})`;

  /** Color of information button */
  colorInformation = 'transparent';
  /** Color of decision button */
  colorDecision = 'transparent';
  /** Color of action button */
  colorAction = 'transparent';
  /** Color of topic button */
  colorTopic = 'transparent';
  /** Contrast personColor of information button */
  contrastInformation = 'transparent';
  /** Contrast personColor of decision button */
  contrastDecision = 'transparent';
  /** Contrast personColor of topic button */
  contrastTopic = 'transparent';

  /**
   * Constructor
   * @param materialColorService material personColor service
   */
  constructor(private materialColorService: MaterialColorService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeColors();
    this.initializeMeetingMinuteItems();
    this.initializeTopic();
  }

  //
  // Initialization
  //

  /**
   * Initializes colors
   */
  private initializeColors() {
    this.colorInformation = this.materialColorService.color(PaletteType.GREY, HueType._400);
    this.colorDecision = this.materialColorService.color(PaletteType.GREY, HueType._500);
    this.colorAction = this.materialColorService.color(PaletteType.GREY, HueType._600);
    this.colorTopic = this.materialColorService.color(PaletteType.GREY, HueType._200);
    this.contrastInformation = this.materialColorService.contrast(PaletteType.GREY, HueType._400);
    this.contrastDecision = this.materialColorService.contrast(PaletteType.GREY, HueType._500);
    this.contrastTopic = this.materialColorService.contrast(PaletteType.GREY, HueType._200);
  }

  /**
   * Initializes meeting minute items
   */
  private initializeMeetingMinuteItems() {
    if (this.meetingMinuteItems == null) {
      this.meetingMinuteItems = [];
    }
  }

  /**
   * Initializes topic
   */
  private initializeTopic() {
    if (this.meetingMinuteItems.length > 0) {
      this.topic = this.meetingMinuteItems[this.meetingMinuteItems.length - 1].topic;
    }
  }

  //
  // Actions
  //

  /**
   * Handles key down event
   * @param event event
   */
  onKeyDown(event: any) {
    if (event.ctrlKey) {
      if (event.key === 'Enter' && event.ctrlKey) {
        this.addInformation(this.text);
      } else {
        const upperCaseKey = event.key.toUpperCase();
        switch (upperCaseKey) {
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
   * Handles changes of a meeting minute item statement
   * @param meetingMinuteItem meeting minute item
   */
  onMeetingMinuteItemChanged(meetingMinuteItem: MeetingMinuteItem) {
    let item = this.meetingMinuteItems.find(i => {
      return i.date.toString() !== meetingMinuteItem.date.toString();
    });

    if (item != null) {
      item = meetingMinuteItem;
      this.meetingMinuteItemsUpdatedEmitter.emit(this.meetingMinuteItems);
    }
  }

  /**
   * Handles deletion of a meeting minute item
   * @param meetingMinuteItem meeting minute item
   */
  onMeetingMinuteItemDeleted(meetingMinuteItem: MeetingMinuteItem) {
    this.meetingMinuteItems = this.meetingMinuteItems.filter(item => {
      return item.date != null
        && meetingMinuteItem.date != null
        && item.date.toString() !== meetingMinuteItem.date.toString();
    });

    this.meetingMinuteItemsUpdatedEmitter.emit(this.meetingMinuteItems);
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

      this.meetingMinuteItemsUpdatedEmitter.emit(this.meetingMinuteItems);
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

      this.meetingMinuteItemsUpdatedEmitter.emit(this.meetingMinuteItems);
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

      this.meetingMinuteItemsUpdatedEmitter.emit(this.meetingMinuteItems);
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

      this.meetingMinuteItemsUpdatedEmitter.emit(this.meetingMinuteItems);
    }
  }
}
