import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {ProjectService} from '../../../services/entities/project.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Project} from '../../../model/entities/project.model';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {MatchService} from '../../../services/entities/filter/match.service';

/**
 * Displays project list
 */
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {

  /** Event emitter indicating menu items being clicked */
  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  /** Projects to be displayed */
  projects = [];
  /** Unfiltered projects */
  projectsAll = [];

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param {ProjectService} projectService
   * @param {MatchService} matchService
   * @param {FilterService} filterService
   * @param {ChangeDetectorRef} changeDetector
   */
  constructor(private projectService: ProjectService,
              private matchService: MatchService,
              private filterService: FilterService,
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
    this.initializeFilterSubscription();
  }

  /**
   * Handles on-destroy lifecycle hook
   */
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Initialization
  //

  /**
   * Initializes projecct subscription
   */
  private initializeProjectSubscription() {
    this.projectsAll = Array.from(this.projectService.projects.values());
    this.update();

    this.projectService.projectsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.projectsAll = value as Project[];
        this.update();
      }
    });
  }

  /**
   * Initializes filter subscription
   */
  private initializeFilterSubscription() {
    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.update();
    });
  }

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  onMenuItemClicked(menuItem: string) {
    this.menuItemClickedEmitter.emit(menuItem);
  }

  /**
   * Filters original values
   */
  private update() {
    this.projects = this.projectsAll.filter(project => {
      const matchesSearchItem = this.matchService.projectMatchesEveryItem(project, this.filterService.searchItem);
      const matchesProjects = this.matchService.projectMatchesProjects(project,
        Array.from(this.filterService.projects.values()),
        this.filterService.projectsNone);

      return matchesSearchItem && matchesProjects;
    });

    this.changeDetector.markForCheck();
  }
}
