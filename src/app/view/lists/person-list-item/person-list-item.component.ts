import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Person} from '../../../model/entities/person.model';

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
  @Output() updatePersonEventEmitter = new EventEmitter<Person>();

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