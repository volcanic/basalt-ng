import {Component, EventEmitter, NgZone, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {ProjectService} from '../../../services/entities/project.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Project} from '../../../model/entities/project.model';
import {FilterService} from '../../../services/filter.service';
import {MatchService} from '../../../services/match.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {

  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  projects = [];
  projectsAll = [];

  private unsubscribeSubject = new Subject();

  constructor(private projectService: ProjectService,
              private matchService: MatchService,
              private filterService: FilterService,
              public zone: NgZone) {
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
    });

    this.zone.run(() => this.projects = JSON.parse(JSON.stringify(this.projects)));
  }
}
