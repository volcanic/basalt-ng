import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Action} from 'app/core/entity/model/action.enum';
import {Person} from '../../../../../core/entity/model/person.model';
import {Media} from '../../../../../core/ui/model/media.enum';

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
  /** Current media */
  @Input() media: Media;
  /** Event emitter indicating person action */
  @Output() personEventEmitter = new EventEmitter<{ action: Action, person: Person }>();

  //
  // Action
  //

  /**
   * Handles person event
   * @param event event
   */
  onPersonEvent(event: any) {
    this.personEventEmitter.emit(event);
  }

  /**
   * Handles click on add button
   */
  onAddClicked() {
    this.personEventEmitter.emit({action: Action.OPEN_DIALOG_ADD, person: null})
  }
}
