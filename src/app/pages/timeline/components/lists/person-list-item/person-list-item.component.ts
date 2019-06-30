import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
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
export class PersonListItemComponent {

  /** Person to be displayed */
  @Input() person: Person;
  /** Current media */
  @Input() media: Media;
  /** Indicates if item is active */
  @Input() active = true;
  /** Event emitter indicating person to be updated */
  @Output() personEventEmitter = new EventEmitter<{ action: Action, person: Person, persons?: Person[] }>();
  /** View child for context menu */
  @ViewChild(MatMenuTrigger, {static: false}) contextMenuTrigger: MatMenuTrigger;

  /** Enum for media types */
  mediaType = Media;
  /** Animation state */
  state = AnimationState.INACTIVE;

  //
  // Actions
  //

  /**
   * Handles hover over container
   * @param hovered whether there is currently a hover event
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
