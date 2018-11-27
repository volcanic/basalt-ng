import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Action} from 'app/core/entity/model/action.enum';
import {Person} from '../../../../../core/entity/model/person.model';
import {Media} from '../../../../../core/ui/model/media.enum';

/**
 * Displays person list
 */
@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonListComponent implements OnChanges {

  /** Persons to be displayed */
  @Input() persons = [];
  /** Persons that are currently filtered */
  @Input() personsFiltered = [];
  /** Number of items to be shown initially **/
  @Input() recentCount: number;
  /** Current media */
  @Input() media: Media;
  /** Event emitter indicating person action */
  @Output() personEventEmitter = new EventEmitter<{ action: Action, person: Person }>();

  /** Recent persons */
  personsRecent = [];
  /** Non-recent persons */
  personsNonRecent = [];

  /** Shows more if true */
  showMoreStatus = false;
  /** Label of more button */
  showMoreLabel = 'More';

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-changes lifecycle phase
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.personsRecent = this.persons.slice(0, this.recentCount);
    if (this.persons.length > this.recentCount) {
      this.personsNonRecent = this.persons.slice(this.recentCount, this.persons.length - 1).sort((p1, p2) => {
        return p2.name < p1.name ? 1 : -1;
      });
    }
  }

  //
  // Action
  //

  /**
   * Handles person event
   * @param event event
   */
  onPersonEvent(event: any) {
    this.personEventEmitter.emit(event);
  }

  /**
   * Handles click on add button
   */
  onAddClicked() {
    this.personEventEmitter.emit({action: Action.OPEN_DIALOG_ADD, person: null});
  }

  /**
   * Handles toggling of more/less button
   */
  onMoreLessToggled() {
    this.showMoreStatus = !this.showMoreStatus;
    this.showMoreLabel = this.showMoreStatus ? 'Less' : 'More';
  }

  //
  // Helpers
  //

  /**
   * Determines whether a person in focus due to filter
   * @param person person
   */
  isInFocus(person: Person) {
    return this.personsFiltered.length === 0 || this.personsFiltered.some(p => {
      return person != null && p != null && p.name === person.name;
    });
  }
}
