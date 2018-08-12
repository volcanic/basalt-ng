import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {takeUntil} from 'rxjs/internal/operators';
import {PersonService} from '../../../services/entities/person.service';
import {Person} from '../../../model/entities/person.model';
import {MatchService} from '../../../services/entities/filter/match.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent implements OnInit, OnDestroy {

  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  persons = [];
  personsAll = [];

  private unsubscribeSubject = new Subject();

  constructor(private personService: PersonService,
              private matchService: MatchService,
              private filterService: FilterService,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {

    this.initializePersonSubscription();
    this.initializeFilterSubscription();
  }

  /**
   * Subscribes person changes
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
   * Subscribes filter changes
   */
  private initializeFilterSubscription() {

    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.update();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  /**
   * Handles click on menu items
   * @param menuItem
   */
  onMenuItemClicked(menuItem: string) {
    this.menuItemClickedEmitter.emit(menuItem);
  }

  /**
   * Filters original values
   */
  private update() {
    this.persons = this.personsAll.sort((p1: Person, p2: Person) => {
      return p2 > p1 ? 1 : -1;
    });

    this.changeDetector.markForCheck();
  }

}
