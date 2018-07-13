import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Person} from '../../../model/person.model';
import {map, startWith} from 'rxjs/internal/operators';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {CloneService} from '../../../services/util/clone.service';

@Component({
  selector: 'app-person-autocomplete-fragment',
  templateUrl: './person-autocomplete-fragment.component.html',
  styleUrls: ['./person-autocomplete-fragment.component.scss']
})
export class PersonAutocompleteFragmentComponent implements OnInit {

  @Input() person: Person;
  @Output() personChangedEmitter = new EventEmitter<Person>();

  value = '';

  options = [];
  filteredOptions: Observable<string[]>;
  formControl: FormControl = new FormControl();

  constructor(private taskletService: TaskletService,
              private cloneService: CloneService) {
  }

  ngOnInit() {
    if (this.person == null) {
      this.person = new Person('');
    }

    // Deep copy
    this.person = this.cloneService.clonePerson(this.person);

    this.options = Array.from(this.taskletService.persons.values()).map(tag => {
      return tag.name;
    }).reverse();

    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterSearchItems(value))
      );
  }

  onKeyUp(event: any) {
    this.notify();
  }

  onOptionSelected(event: any) {
    this.notify();
  }

  filterSearchItems(value: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }

  notify() {
    this.personChangedEmitter.emit(this.person);
  }

}
