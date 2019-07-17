import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Action} from 'app/core/entity/model/action.enum';
import {Project} from '../../../../../core/entity/model/project.model';
import {Media} from '../../../../../core/ui/model/media.enum';
import {ProjectService} from '../../../../../core/entity/services/project/project.service';

/**
 * Displays project list
 */
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnChanges {

  /** Map of projects */
  @Input() projectsMap = new Map<string, Project>();
  /** Map of projects used for filtering */
  @Input() projectsMapFilter = new Map<string, Project>();
  /** Number of items to be shown initially */
  @Input() recentCount: number;
  /** Current media */
  @Input() media: Media;
  /** Event emitter indicating project action */
  @Output() projectEventEmitter = new EventEmitter<{ action: Action, project: Project }>();

  /** Recent projects */
  projectsRecent = [];
  /** Non-recent projects */
  projectsNonRecent = [];

  /** Shows more if true */
  showMoreStatus = false;
  /** Label of more button */
  showMoreLabel = 'More';

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-changes lifecycle phase
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initializeProjects();
  }

  //
  // Initialization
  //

  /**
   * Initializes projects
   */
  private initializeProjects() {
    const projects = Array.from(this.projectsMap.values())
      .sort(ProjectService.sortProjectsByName)
      .sort(ProjectService.sortProjectsByModificationDate);

    if (projects != null) {
      this.projectsRecent = projects.slice(0, this.recentCount);
      if (projects.length > this.recentCount) {
        this.projectsNonRecent = projects.slice(this.recentCount, projects.length - 1).sort((p1, p2) => {
          return p2.name < p1.name ? 1 : -1;
        });
      }
    }
  }

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
   * Handles toggling of more/less button
   */
  onMoreLessToggled() {
    this.showMoreStatus = !this.showMoreStatus;
    this.showMoreLabel = this.showMoreStatus ? 'Less' : 'More';
  }

  //
  // Helpers
  //

  /**
   * Determines whether a project in focus due to filter
   * @param project project
   */
  isInFocus(project: Project) {
    return this.projectsMapFilter.size === 0 || Array.from(this.projectsMapFilter.values()).some(p => {
      return project != null && p != null && p.name === project.name;
    });
  }
}
