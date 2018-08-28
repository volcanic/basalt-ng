import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Project} from '../../../model/entities/project.model';
import {Action} from '../../../model/ui/action.enum';

/**
 * Displays project list item
 */
@Component({
  selector: 'app-filter-project-list-item',
  templateUrl: './filter-project-list-item.component.html',
  styleUrls: ['./filter-project-list-item.component.scss']
})
export class FilterProjectListItemComponent {

  /** Project to be displayed */
  @Input() project: Project;
  /** Event emitter indicating project action */
  @Output() projectEventEmitter = new EventEmitter<{ action: Action, value: Project[] }>();

  /** Enum for action types */
  action = Action;
  /** Animation state */
  state = 'inactive';

  //
  // Actions
  //

  /**
   * Handles hover over container
   * @param {boolean} hovered whether there is currently a hover event
   */
  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }
}
