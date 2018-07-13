import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Person} from '../../../model/person.model';
import {Observable} from 'rxjs/Rx';
import {FormControl} from '@angular/forms';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {map, startWith} from 'rxjs/internal/operators';

@Component({
  selector: 'app-person-chips-fragment',
  templateUrl: './person-chips-fragment.component.html',
  styleUrls: ['./person-chips-fragment.component.scss']
})
export class PersonChipsFragmentComponent implements OnInit {

  @Input() persons: Person[] = [];
  @Output() personChangedEmitter = new EventEmitter<Person[]>();

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

    if (this.value !== '' && this.value !== ',' && (event.keyCode == KEY_CODE_ENTER || event.keyCode == KEY_CODE_COMMA)) {
      this.persons.push(new Person(this.value.replace(/,/, '')));
      this.value = '';
      this.notify();
    }
  }

  onKeyDown(event: any) {
    this.value = this.value.replace(/,/, '');
  }

  filterSearchItems(value: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    ).reverse();
  }

  notify() {
    this.personChangedEmitter.emit(this.persons);
  }
}
