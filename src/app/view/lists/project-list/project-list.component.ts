import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Action} from '../../../model/ui/action.enum';

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
  /** Event emitter indicating project actions */
  @Output() projectEventEmitter = new EventEmitter<{ Action, Project }>();

  /** Enum for action types */
  action = Action;
}
