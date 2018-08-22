import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CloneService} from '../../../services/util/clone.service';
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
  /** Event emitter indicating project filter to be updated */
  @Output() filterProjectEventEmitter = new EventEmitter<Project[]>();
  /** Event emitter indicating project none to be updated */
  @Output() filterProjectNoneEventEmitter = new EventEmitter<Boolean>();

  //
  // Actions
  //

  /**
   * Handles changes of single project
   * @param {Project} project project that changed
   */
  onProjectFilterUpdate(project: Project) {
    this.filterProjectEventEmitter.emit([project]);
  }

  /**
   * Handles changes of project-none flag
   */
  onProjectNoneFlagChanged() {
    this.filterProjectNoneEventEmitter.emit(this.projectsNone);
  }

  /**
   * Handles click on button that sets all values to the same
   */
  onSetAll(checked: boolean) {
    this.projects.forEach(t => {
      t.checked = checked;
    });
    this.projects = CloneService.cloneProjects(this.projects);
    this.projectsNone = checked;

    this.filterProjectEventEmitter.emit(this.projects);
    this.filterProjectNoneEventEmitter.emit(this.projectsNone);
  }
}
