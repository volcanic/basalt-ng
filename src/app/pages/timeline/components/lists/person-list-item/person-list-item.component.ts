import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Person} from 'app/core/entity/model/person.model';
import {Action} from 'app/core/entity/model/action.enum';

/**
 * Displays person list item
 */
@Component({
  selector: 'app-person-list-item',
  templateUrl: './person-list-item.component.html',
  styleUrls: ['./person-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonListItemComponent {

  /** Person to be displayed */
  @Input() person: Person;
  /** Event emitter indicating person to be updated */
  @Output() personEventEmitter = new EventEmitter<Person>();

  /** Enum for action types */
  action = Action;
  /** Animation state */
  state = 'inactive';

  //
  // Actions
  //

  /**
   * Handles hover over container
   * @param {boolean} hovered whether there is currently a hover event
   */
  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }
}
