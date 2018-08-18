import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {Project} from '../../../model/entities/project.model';
import {MatchService} from '../../../services/entities/filter/match.service';

/**
 * Displays filter project list
 */
@Component({
  selector: 'app-filter-project-list',
  templateUrl: './filter-project-list.component.html',
  styleUrls: ['./filter-project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterProjectListComponent implements OnInit {

  /** Projects to be displayed */
  projects = [];
  /** Flag indicating whether entities without project shall be displayed */
  projectsNone = false;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param {FilterService} filterService
   * @param {MatchService} matchService
   * @param {ChangeDetectorRef} changeDetector
   */
  constructor(private filterService: FilterService,
              private matchService: MatchService,
              private changeDetector: ChangeDetectorRef) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeProjectSubscription();
  }

  //
  // Initialization
  //

  /**
   * Initializes project subscription
   */
  private initializeProjectSubscription() {
    this.projects = Array.from(this.filterService.projects.values()).sort((p1: Project, p2: Project) => {
      return -MatchService.compare(p1.modificationDate.toString(), p2.modificationDate.toString());
    });
    this.projectsNone = this.filterService.projectsNone;

    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
        this.projects = Array.from(this.filterService.projects.values()).sort((p1: Project, p2: Project) => {
          return -MatchService.compare(p1.modificationDate.toString(), p2.modificationDate.toString());
        });
        this.projectsNone = this.filterService.projectsNone;
        this.changeDetector.markForCheck();
      }
    );
  }

  //
  // Actions
  //

  /**
   * Handles click on select-all button
   */
  onSelectAll() {
    this.projects.forEach(t => {
      t.checked = true;
    });
    this.projectsNone = true;
    this.filterService.updateProjects(this.projects, false, this.projectsNone);
  }

  /**
   * Handles click on select-none button
   */
  onSelectNone() {
    this.projects.forEach(t => {
      t.checked = false;
    });
    this.projectsNone = false;
    this.filterService.updateProjects(this.projects, false, this.projectsNone);
  }

  /**
   * Handles changes of project-none flag
   */
  onProjectNoneFlagChanged() {
    this.filterService.updateProjects(this.projects, false, this.projectsNone);
  }
}
