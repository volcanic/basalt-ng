import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Person} from '../../../model/entities/person.model';
import {MatchService} from '../../../services/entities/filter/match.service';

@Component({
  selector: 'app-filter-person-list',
  templateUrl: './filter-person-list.component.html',
  styleUrls: ['./filter-person-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterPersonListComponent implements OnInit {

  persons = [];
  personsNone = false;

  private unsubscribeSubject = new Subject();

  constructor(private filterService: FilterService,
              private matchService: MatchService,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.initializePersonSubscription();
  }

  //
  // Initialization
  //

  /**
   * Subscribes person changes
   */
  private initializePersonSubscription() {

    this.persons = Array.from(this.filterService.persons.values()).sort((t1: Person, t2: Person) => {
      return this.matchService.compare(t1.name, t2.name);
    });
    this.personsNone = this.filterService.personsNone;

    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
        this.persons = Array.from(this.filterService.persons.values()).sort((t1: Person, t2: Person) => {
          return this.matchService.compare(t1.name, t2.name);
        });
        this.personsNone = this.filterService.personsNone;
        this.changeDetector.markForCheck();
      }
    );
  }

  //
  // Actions
  //

  onSelectAll() {
    this.persons.forEach(t => {
      t.checked = true;
    });
    this.personsNone = true;
    this.filterService.updatePersons(this.persons, false, this.personsNone);
  }

  onSelectNone() {
    this.persons.forEach(t => {
      t.checked = false;
    });
    this.personsNone = false;
    this.filterService.updatePersons(this.persons, false, this.personsNone);
  }

  onChangeSpecialPerson(value: boolean) {
    this.filterService.updatePersons(this.persons, value, this.personsNone);
  }
}
