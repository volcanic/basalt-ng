import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Person} from '../../../model/entities/person.model';

/**
 * Displays filter person list item
 */
@Component({
  selector: 'app-filter-person-list-item',
  templateUrl: './filter-person-list-item.component.html',
  styleUrls: ['./filter-person-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterPersonListItemComponent {

  /** Person to be displayed */
  @Input() person: Person;
  /** Event emitter indicating person filter to be updated */
  @Output() updatePersonFilterEventEmitter = new EventEmitter<Person>();

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
