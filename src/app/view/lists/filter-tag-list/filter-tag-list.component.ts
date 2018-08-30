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

  /** Project to be displayed */
  @Input() projects = [];
  /** Flag indicating whether entities without project shall be displayed */
  @Input() projectsNone = false;
  /** Event emitter indicating project actions */
  @Output() projectEventEmitter = new EventEmitter<{ action: Action, value: any }>();

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
    this.projects.forEach(t => {
      t.checked = checked;
    });
    this.projects = CloneService.cloneProjects(this.projects);
    this.projectsNone = checked;

    this.projectEventEmitter.emit({action: Action.FILTER_LIST, value: this.projects});
    this.projectEventEmitter.emit({action: Action.FILTER_NONE, value: this.projectsNone});
  }
}
