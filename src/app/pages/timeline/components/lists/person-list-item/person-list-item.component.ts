import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Person} from 'app/core/entity/model/person.model';
import {Action} from 'app/core/entity/model/action.enum';
import {Media} from '../../../../../core/ui/model/media.enum';
import {MatMenuTrigger} from '@angular/material';
import {Animations} from './person-list-item.animation';
import {AnimationState} from '../task-list-item/task-list-item.animation';

/**
 * Displays person list item
 */
@Component({
  selector: 'app-person-list-item',
  templateUrl: './person-list-item.component.html',
  styleUrls: ['./person-list-item.component.scss'],
  animations: [
    Animations.actionAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonListItemComponent implements OnChanges {

  /** Person to be displayed */
  @Input() person: Person;
  /** Current media */
  @Input() media: Media;
  /** Displays item opaque if true */
  @Input() opaque = false;
  /** Event emitter indicating person to be updated */
  @Output() personEventEmitter = new EventEmitter<{ action: Action, person: Person, persons?: Person[] }>();
  /** View child for context menu */
  @ViewChild(MatMenuTrigger) contextMenuTrigger: MatMenuTrigger;

  /** CSS class that handles opacity */
  opaqueClass = '';

  /** Enum for media types */
  mediaType = Media;
  /** Animation state */
  state = AnimationState.INACTIVE;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-changes lifecycle phase
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initializeOpacity();
  }

  //
  // Initialization
  //

  /**
   * Initializes opacity
   */
  private initializeOpacity() {
    this.opaqueClass = this.opaque ? 'opaque' : '';
  }

  //
  // Actions
  //

  /**
   * Handles hover over container
   * @param {boolean} hovered whether there is currently a hover event
   */
  onHoverContainer(hovered: boolean) {
    this.state = hovered ? AnimationState.ACTIVE : AnimationState.INACTIVE;
  }

  /**
   * Handles click on person
   */
  onPersonClicked() {
    this.personEventEmitter.emit({action: Action.OPEN_DIALOG_UPDATE, person: this.person});
  }

  /**
   * Handles clicks on filter button
   */
  onFilterClicked() {
    this.personEventEmitter.emit({action: Action.FILTER_SINGLE, person: null, persons: [this.person]});
  }
}
