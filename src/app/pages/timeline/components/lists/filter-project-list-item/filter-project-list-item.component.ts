import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Action} from 'app/core/entity/model/action.enum';
import {Project} from 'app/core/entity/model/project.model';

/**
 * Displays project list item
 */
@Component({
  selector: 'app-filter-project-list-item',
  templateUrl: './filter-project-list-item.component.html',
  styleUrls: ['./filter-project-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterProjectListItemComponent {

  /** Project to be displayed */
  @Input() project: Project;
  /** Event emitter indicating project action */
  @Output() projectEventEmitter = new EventEmitter<{ action: Action, projects: Project[] }>();

  //
  // Actions
  //

  /**
   * Handles (un-)selecting a project
   */
  onProjectChanged(project: Project) {
    this.projectEventEmitter.emit({action: Action.FILTER_LIST, projects: [project]});
  }
}