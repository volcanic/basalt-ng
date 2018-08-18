import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Person} from '../../../model/entities/person.model';
import {MatchService} from '../../../services/entities/filter/match.service';

/**
 * Displays filter person list
 */
@Component({
  selector: 'app-filter-person-list',
  templateUrl: './filter-person-list.component.html',
  styleUrls: ['./filter-person-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterPersonListComponent implements OnInit {

  /** Persons to be displayed */
  persons = [];
  /** Flag indicating whether entities without person shall be displayed */
  personsNone = false;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param {FilterService} filterService
   * @param {MatchService} matchService
   * @param {ChangeDetectorRef} changeDetector
   */
  constructor(private filterService: FilterService,
              private matchService: MatchService,
              private changeDetector: ChangeDetectorRef) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializePersonSubscription();
  }

  //
  // Initialization
  //

  /**
   * Initializes person subscription
   */
  private initializePersonSubscription() {
    this.persons = Array.from(this.filterService.persons.values()).sort((t1: Person, t2: Person) => {
      return MatchService.compare(t1.name, t2.name);
    });
    this.personsNone = this.filterService.personsNone;

    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
        this.persons = Array.from(this.filterService.persons.values()).sort((t1: Person, t2: Person) => {
          return MatchService.compare(t1.name, t2.name);
        });
        this.personsNone = this.filterService.personsNone;
        this.changeDetector.markForCheck();
      }
    );
  }

  //
  // Actions
  //

  /**
   * Handles click on select-all button
   */
  onSelectAll() {
    this.persons.forEach(t => {
      t.checked = true;
    });
    this.personsNone = true;
    this.filterService.updatePersons(this.persons, false, this.personsNone);
  }

  /**
   * Handles click on select-none button
   */
  onSelectNone() {
    this.persons.forEach(t => {
      t.checked = false;
    });
    this.personsNone = false;
    this.filterService.updatePersons(this.persons, false, this.personsNone);
  }

  /**
   * Handles changes of person-none flag
   */
  onPersonNoneFlagChanged() {
    this.filterService.updatePersons(this.persons, false, this.personsNone);
  }
}
