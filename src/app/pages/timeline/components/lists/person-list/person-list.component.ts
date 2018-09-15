import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Action} from 'app/core/entity/model/action.enum';

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
  /** Event emitter indicating person action */
  @Output() personEventEmitter = new EventEmitter<{ Action, Person }>();

  /** Enum for action types */
  action = Action;
}
