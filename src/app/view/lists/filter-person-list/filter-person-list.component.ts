import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Person} from '../../../model/entities/person.model';
import {CloneService} from '../../../services/util/clone.service';

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
  /** Event emitter indicating person filter to be updated */
  @Output() filterPersonsEventEmitter = new EventEmitter<Person[]>();
  /** Event emitter indicating person none to be updated */
  @Output() filterPersonsNoneEventEmitter = new EventEmitter<Boolean>();

  //
  // Actions
  //

  /**
   * Handles changes of single person
   * @param {Person} person person that changed
   */
  onPersonFilterUpdate(person: Person) {
    this.filterPersonsEventEmitter.emit([person]);
  }

  /**
   * Handles changes of person-none flag
   */
  onPersonNoneFlagChanged() {
    this.filterPersonsNoneEventEmitter.emit(this.personsNone);
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

    this.filterPersonsEventEmitter.emit(this.persons);
    this.filterPersonsNoneEventEmitter.emit(this.personsNone);
  }
}
