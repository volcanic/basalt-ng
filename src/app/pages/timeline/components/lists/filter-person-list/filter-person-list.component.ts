import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CloneService} from 'app/core/entity/services/clone.service';
import {Action} from 'app/core/entity/model/action.enum';
import {Person} from 'app/core/entity/model/person.model';

/**
 * Displays filter person list
 */
@Component({
  selector: 'app-filter-person-list',
  templateUrl: './filter-person-list.component.html',
  styleUrls: ['./filter-person-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterPersonListComponent {

  /** Persons to be displayed */
  @Input() persons = [];
  /** Flag indicating whether entities without person shall be displayed */
  @Input() personsNone = false;
  /** Event emitter indicating person action */
  @Output() personEventEmitter = new EventEmitter<{ action: Action, persons?: Person[], personsNone?: boolean }>();

  /** Enum for action types */
  action = Action;

  //
  // Actions
  //

  /**
   * Handles (de-)selection of none
   * @param personsNone persons none flag
   */
  onFilterNone(personsNone: boolean) {
    this.personEventEmitter.emit({action: Action.FILTER_NONE, personsNone: personsNone});
  }

  /**
   * Handles click on button that sets all values to the same
   */
  onSetAll(checked: boolean) {
    this.persons.forEach(t => {
      t.checked = checked;
    });
    this.persons = CloneService.clonePersons(this.persons);
    this.personsNone = checked;

    this.personEventEmitter.emit({action: Action.FILTER_ALL, persons: this.persons, personsNone: this.personsNone});
  }
}
