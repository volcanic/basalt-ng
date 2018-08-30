import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Action} from '../../../model/ui/action.enum';
import {CloneService} from '../../../services/util/clone.service';

/**
 * Displays filter tag list
 */
@Component({
  selector: 'app-filter-tag-list',
  templateUrl: './filter-tag-list.component.html',
  styleUrls: ['./filter-tag-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterTagListComponent {

  /** Tag to be displayed */
  @Input() tags = [];
  /** Flag indicating whether entities without tag shall be displayed */
  @Input() tagsNone = false;
  /** Event emitter indicating tag action */
  @Output() tagEventEmitter = new EventEmitter<{ action: Action, list: any[], none: boolean }>();

  /** Enum for action types */
  action = Action;

  //
  // Actions
  //

  /**
   * Handles click on button that sets all values to the same
   * @param checked whether to check all filter values or not
   */
  onSetAll(checked: boolean) {
    this.tags.forEach(t => {
      t.checked = checked;
    });
    this.tags = CloneService.cloneTags(this.tags);
    this.tagsNone = checked;

    this.tagEventEmitter.emit({action: Action.FILTER_ALL, list: this.tags, none: this.tagsNone});
  }
}
