import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Action} from 'app/core/entity/model/action.enum';

/**
 * Displays project list
 */
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent {

  /** Projects to be displayed */
  @Input() projects = [];
  /** Event emitter indicating project action */
  @Output() projectEventEmitter = new EventEmitter<{ Action, Project }>();

  /** Enum for action types */
  action = Action;
}
