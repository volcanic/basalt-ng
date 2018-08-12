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

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {

  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  projects = [];
  projectsAll = [];

  private unsubscribeSubject = new Subject();

  constructor(private projectService: ProjectService,
              private matchService: MatchService,
              private filterService: FilterService,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {

    this.initializeProjectSubscription();
    this.initializeFilterSubscription();
  }

  /**
   * Subscribes project changes
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
   * Subscribes filter changes
   */
  private initializeFilterSubscription() {

    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.update();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  /**
   * Handles click on menu items
   * @param menuItem
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
    }).sort((p1: Project, p2: Project) => {
      return -this.matchService.compare(p1.modificationDate.toString(), p2.modificationDate.toString());
    });

    this.changeDetector.markForCheck();
  }
}
