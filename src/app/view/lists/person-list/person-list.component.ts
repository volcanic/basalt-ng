import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {takeUntil} from 'rxjs/internal/operators';
import {PersonService} from '../../../services/entities/person.service';
import {Person} from '../../../model/entities/person.model';
import {MatchService} from '../../../services/entities/filter/match.service';

/**
 * Displays person list
 */
@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent implements OnInit, OnDestroy {

  /** Event emitter indicating menu items being clicked */
  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  /** Persons to be displayed */
  persons = [];
  /** Unfiltered persons */
  personsAll = [];

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param {PersonService} personService
   * @param {MatchService} matchService
   * @param {FilterService} filterService
   * @param {ChangeDetectorRef} changeDetector
   */
  constructor(private personService: PersonService,
              private matchService: MatchService,
              private filterService: FilterService,
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
    this.initializeFilterSubscription();
  }

  /**
   * Initializes person subscription
   */
  private initializePersonSubscription() {
    this.personsAll = Array.from(this.personService.persons.values());
    this.update();

    this.personService.personsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.personsAll = value as Person[];
        this.update();
      }
    });
  }

  /**
   * Initializes filter subscription
   */
  private initializeFilterSubscription() {
    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.update();
    });
  }

  /**
   * Handles on-destroy lifecycle hook
   */
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  onMenuItemClicked(menuItem: string) {
    this.menuItemClickedEmitter.emit(menuItem);
  }

  /**
   * Filters original values
   */
  private update() {
    this.persons = this.personsAll.filter(person => {
      const matchesSearchItem = this.matchService.personMatchesEveryItem(person, this.filterService.searchItem);
      const matchesPersons = this.matchService.personMatchesPersons(person,
        Array.from(this.filterService.persons.values()),
        this.filterService.personsNone);

      return matchesSearchItem && matchesPersons;
    }).sort((p1: Person, p2: Person) => {
      return p2 > p1 ? 1 : -1;
    });

    this.changeDetector.markForCheck();
  }

}
