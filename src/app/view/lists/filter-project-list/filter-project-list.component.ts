import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CloneService} from '../../../services/util/clone.service';
import {Action} from '../../../model/ui/action.enum';
import {Project} from '../../../model/entities/project.model';

/**
 * Displays filter project list
 */
@Component({
  selector: 'app-filter-project-list',
  templateUrl: './filter-project-list.component.html',
  styleUrls: ['./filter-project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterProjectListComponent {

  /** Project to be displayed */
  @Input() projects = [];
  /** Flag indicating whether entities without project shall be displayed */
  @Input() projectsNone = false;
  /** Event emitter indicating project action */
  @Output() projectEventEmitter = new EventEmitter<{ action: Action, projects?: Project[], projectsNone?: boolean }>();

  //
  // Actions
  //

  /**
   * Handles (de-)selection of none
   * @param projectsNone projects none flag
   */
  onFilterNone(projectsNone: boolean) {
    this.projectEventEmitter.emit({action: Action.FILTER_NONE, projectsNone: projectsNone});
  }

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

    this.projectEventEmitter.emit({
      action: Action.FILTER_ALL,
      projects: this.projects,
      projectsNone: this.projectsNone
    });
  }
}
