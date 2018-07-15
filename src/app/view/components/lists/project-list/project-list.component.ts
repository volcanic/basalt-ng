import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {ProjectService} from '../../../../services/entities/project.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Project} from '../../../../model/entities/project.model';
import {FilterService} from '../../../../services/filter.service';
import {MatchService} from '../../../../services/match.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {

  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  projects = [];

  private projectsUnsubscribeSubject = new Subject();

  constructor(private projectService: ProjectService,
              private matchService: MatchService,
              private filterService: FilterService,) {
  }

  ngOnInit() {

    this.initializeProjectSubscription();
  }

  /**
   * Subscribes project changes
   */
  private initializeProjectSubscription() {

    this.projectService.projectsSubject.pipe(
      takeUntil(this.projectsUnsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        const projects = value as Project[];

        this.projects = projects.filter(project => {
          const matchesSearchItem = this.matchService.projectMatchesEveryItem(project, this.filterService.searchItem);
          const matchesProjects = this.matchService.projectMatchesProjects(project,
            Array.from(this.filterService.projects.values()),
            this.filterService.projectsNone);

          return matchesSearchItem && matchesProjects;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.projectsUnsubscribeSubject.next();
    this.projectsUnsubscribeSubject.complete();
  }

  /**
   * Handles click on menu items
   * @param menuItem
   */
  onMenuItemClicked(menuItem: string) {
    this.menuItemClickedEmitter.emit(menuItem);
  }
}
