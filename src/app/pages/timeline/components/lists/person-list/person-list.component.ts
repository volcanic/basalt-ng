import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Action} from 'app/core/entity/model/action.enum';
import {Person} from '../../../../../core/entity/model/person.model';
import {Media} from '../../../../../core/ui/model/media.enum';
import {PersonService} from '../../../../../core/entity/services/person/person.service';

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

  /** Map of persons */
  @Input() personsMap = new Map<string, Person>();
  /** Map of persons used for filtering */
  @Input() personsMapFilter = new Map<string, Person>();
  /** Number of items to be shown initially */
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
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initializePersons();
  }

  //
  // Initialization
  //

  /**
   * Initializes persons
   */
  private initializePersons() {
    const persons = Array.from(this.personsMap.values())
      .sort(PersonService.sortPersonsByName)
      .sort(PersonService.sortPersonsByModificationDate);

    this.personsRecent = persons.slice(0, this.recentCount);
    if (persons.length > this.recentCount) {
      this.personsNonRecent = persons.slice(this.recentCount, persons.length - 1).sort((p1, p2) => {
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
    return this.personsMapFilter.size === 0 || Array.from(this.personsMapFilter.values()).some(p => {
      return person != null && p != null && p.name === person.name;
    });
  }
}
