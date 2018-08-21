import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Person} from '../../../model/entities/person.model';

/**
 * Displays person list
 */
@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonListComponent {

  /** Persons to be displayed */
  @Input() persons = [];
  /** Event emitter indicating person to be updated */
  @Output() upsertPersonEventEmitter = new EventEmitter<Person>();
}