import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Project} from 'app/core/entity/model/project.model';
import {Action} from 'app/core/entity/model/action.enum';

/**
 * Displays project list item
 */
@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.scss']
})
export class ProjectListItemComponent {

  /** Project to be displayed */
  @Input() project: Project;
  /** Event emitter indicating project to be updated */
  @Output() projectEventEmitter = new EventEmitter<{ action: Action, project: Project }>();

  /** Animation state */
  state = 'inactive';

  //
  // Actions
  //

  /**
   * Handles click on project
   */
  onProjectClicked() {
    this.projectEventEmitter.emit({action: Action.OPEN_DIALOG_UPDATE, project: this.project})
  }

  /**
   * Handles hover over container
   * @param {boolean} hovered whether there is currently a hover event
   */
  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }
}
