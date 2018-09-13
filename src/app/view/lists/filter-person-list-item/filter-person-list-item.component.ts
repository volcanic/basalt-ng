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
  @Output() personEventEmitter = new EventEmitter<{ action: Action, persons: Person[] }>();

  //
  // Actions
  //

  /**
   * Handles (un-)selecting a person
   */
  onPersonChanged(person: Person) {
    this.personEventEmitter.emit({action: Action.FILTER_LIST, persons: [person]});
  }
}
