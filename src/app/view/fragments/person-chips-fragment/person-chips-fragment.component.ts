import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Person} from '../../../model/person.model';
import {Observable} from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {map, startWith} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {Task} from '../../../model/entities/task.model';
import {debounceTime} from 'rxjs/operators';
import {Tag} from '../../../model/tag.model';

@Component({
  selector: 'app-person-chips-fragment',
  templateUrl: './person-chips-fragment.component.html',
  styleUrls: ['./person-chips-fragment.component.scss']
})
export class PersonChipsFragmentComponent implements OnInit {

  @Input() persons: Person[] = [];
  @Input() disabled = false;
  @Output() personChangedEmitter = new EventEmitter<Person[]>();

  debouncer = new Subject();

  value = '';

  options = [];
  filteredOptions: Observable<string[]>;
  formControl: FormControl = new FormControl();

  constructor(private taskletService: TaskletService) {
  }

  ngOnInit() {
    this.taskletService.updatePersons();
    this.options = Array.from(this.taskletService.persons.values()).map(person => {
      return person.name;
    });

    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterSearchItems(value))
      );

    this.debouncer.pipe(
      debounceTime(500)
    ).subscribe((value: Person[]) => this.personChangedEmitter.emit(value));
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
      this.persons.push(new Person(this.value.replace(/,/, '')));
      this.value = '';
      this.notify();
    }
  }

  onKeyDown(event: any) {
    this.value = this.value.replace(/,/, '');
  }

  onOptionSelected(event: any) {
    if (!this.disabled) {
      this.persons.push(new Person(this.value.replace(/,/, '')));
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
