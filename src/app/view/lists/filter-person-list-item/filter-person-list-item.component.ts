import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Person} from '../../../model/entities/person.model';
import {Action} from '../../../model/ui/action.enum';

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
  /** Event emitter indicating person action */
  @Output() personEventEmitter = new EventEmitter<{ action: Action, value: Person }>();

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
