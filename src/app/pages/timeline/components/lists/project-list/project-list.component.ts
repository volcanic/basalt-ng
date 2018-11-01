import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Action} from 'app/core/entity/model/action.enum';
import {Project} from '../../../../../core/entity/model/project.model';
import {Media} from '../../../../../core/ui/model/media.enum';

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
  /** Current media */
  @Input() media: Media;
  /** Event emitter indicating project action */
  @Output() projectEventEmitter = new EventEmitter<{ action: Action, project: Project }>();

  //
  // Action
  //

  /**
   * Handles project event
   * @param event event
   */
  onProjectEvent(event: any) {
    this.projectEventEmitter.emit(event);
  }

  /**
   * Handles click on add button
   */
  onAddClicked() {
    this.projectEventEmitter.emit({action: Action.OPEN_DIALOG_ADD, project: null});
  }
}
