import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Action} from 'app/core/entity/model/action.enum';
import {Tag} from '../../../../../core/entity/model/tag.model';

/**
 * Displays tag list
 */
@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListComponent {

  /** Tags to be displayed */
  @Input() tags = [];
  /** Event emitter indicating tag action */
  @Output() tagEventEmitter = new EventEmitter<{ action: Action, tag: Tag }>();

  //
  // Action
  //

  /**
   * Handles tag event
   * @param event event
   */
  onTagEvent(event: any) {
    this.tagEventEmitter.emit(event);
  }

  /**
   * Handles click on add button
   */
  onAddClicked() {
    this.tagEventEmitter.emit({action: Action.OPEN_DIALOG_ADD, tag: null})
  }
}
