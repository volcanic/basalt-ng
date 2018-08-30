import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CloneService} from '../../../services/util/clone.service';
import {Action} from '../../../model/ui/action.enum';

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
  @Output() personEventEmitter = new EventEmitter<{ action: Action, list: any[], none: boolean }>();

  /** Enum for action types */
  action = Action;

  //
  // Actions
  //

  /**
   * Handles click on button that sets all values to the same
   */
  onSetAll(checked: boolean) {
    this.persons.forEach(t => {
      t.checked = checked;
    });
    this.persons = CloneService.clonePersons(this.persons);
    this.personsNone = checked;

    this.personEventEmitter.emit({action: Action.FILTER_ALL, list: this.persons, none: this.personsNone});
  }
}
