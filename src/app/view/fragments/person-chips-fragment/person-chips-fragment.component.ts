import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Person} from '../../../model/entities/person.model';
import {Observable} from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {map, startWith} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';
import {SuggestionService} from '../../../services/entities/filter/suggestion.service';
import {PersonService} from '../../../services/entities/person.service';

@Component({
  selector: 'app-person-chips-fragment',
  templateUrl: './person-chips-fragment.component.html',
  styleUrls: ['./person-chips-fragment.component.scss']
})
export class PersonChipsFragmentComponent implements OnInit {

  @Input() persons: Person[] = [];
  @Input() disabled = false;
  @Output() personsChangedEmitter = new EventEmitter<Person[]>();

  debouncer = new Subject();

  value = '';

  options = [];
  filteredOptions: Observable<string[]>;
  formControl: FormControl = new FormControl();

  constructor(private personService: PersonService,
              private taskletService: TaskletService,
              private suggestionService: SuggestionService) {
  }

  ngOnInit() {

    this.options = Array.from(this.suggestionService.personOptions.values());

    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterSearchItems(value))
      );

    this.debouncer.pipe(
      debounceTime(500)
    ).subscribe((value: Person[]) => this.personsChangedEmitter.emit(value));
  }

  onDeletePerson(value: Person) {
    this.persons = this.persons.filter(person => {
      return person.name !== value.name;
    });

    this.notify();
  }

  onKeyUp(event: any) {
    const KEY_CODE_ENTER = 13;
    const KEY_CODE_COMMA = 188;

    if (this.value !== '' && this.value !== ',' && (event.keyCode === KEY_CODE_ENTER || event.keyCode === KEY_CODE_COMMA)) {
      this.persons.push(new Person(this.value.replace(/,/, ''), true));
      this.value = '';
      this.notify();
    }
  }

  onKeyDown() {
    this.value = this.value.replace(/,/, '');
  }

  onOptionSelected() {
    if (!this.disabled) {
      this.persons.push(new Person(this.value.replace(/,/, ''), true));
      this.value = '';
      this.notify();
    }
  }

  filterSearchItems(value: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    ).reverse();
  }

  notify() {
    this.debouncer.next(this.persons);
  }
}
