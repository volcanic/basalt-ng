import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Action} from 'app/core/entity/model/action.enum';
import {Person} from 'app/core/entity/model/person.model';

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
