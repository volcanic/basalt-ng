import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Action} from '../../../model/ui/action.enum';
import {CloneService} from '../../../services/util/clone.service';
import {Tag} from '../../../model/entities/tag.model';

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
  @Output() tagEventEmitter = new EventEmitter<{ action: Action, tags?: Tag[], tagsNone: boolean }>();

  /** Enum for action types */
  action = Action;

  //
  // Actions
  //

  /**
   * Handles (de-)selection of none
   * @param tagsNone tags none flag
   */
  onFilterNone(tagsNone: boolean) {
    this.tagEventEmitter.emit({action: Action.FILTER_NONE, tagsNone: tagsNone});
  }

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

    this.tagEventEmitter.emit({action: Action.FILTER_ALL, tags: this.tags, tagsNone: this.tagsNone});
  }
}
