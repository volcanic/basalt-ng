import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Project} from '../../../model/entities/project.model';

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
  /** Event emitter indicating project to be updated */
  @Output() upsertProjectEventEmitter = new EventEmitter<Project>();
}
