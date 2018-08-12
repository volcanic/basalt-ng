import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {Project} from '../../../model/entities/project.model';
import {MatchService} from '../../../services/entities/filter/match.service';

@Component({
  selector: 'app-filter-project-list',
  templateUrl: './filter-project-list.component.html',
  styleUrls: ['./filter-project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterProjectListComponent implements OnInit {

  projects = [];
  projectsNone = false;

  private unsubscribeSubject = new Subject();

  constructor(private filterService: FilterService,
              private matchService: MatchService,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.initializeProjectSubscription();
  }

  //
  // Initialization
  //

  /**
   * Subscribes project changes
   */
  private initializeProjectSubscription() {

    this.projects = Array.from(this.filterService.projects.values()).sort((p1: Project, p2: Project) => {
      return -this.matchService.compare(p1.modificationDate.toString(), p2.modificationDate.toString());
    });
    this.projectsNone = this.filterService.projectsNone;

    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
        this.projects = Array.from(this.filterService.projects.values()).sort((p1: Project, p2: Project) => {
          return -this.matchService.compare(p1.modificationDate.toString(), p2.modificationDate.toString());
        });
        this.projectsNone = this.filterService.projectsNone;
        this.changeDetector.markForCheck();
      }
    );
  }

  //
  // Actions
  //

  onSelectAll() {
    this.projects.forEach(t => {
      t.checked = true;
    });
    this.projectsNone = true;
    this.filterService.updateProjects(this.projects, false, this.projectsNone);
  }

  onSelectNone() {
    this.projects.forEach(t => {
      t.checked = false;
    });
    this.projectsNone = false;
    this.filterService.updateProjects(this.projects, false, this.projectsNone);
  }

  onChangeSpecialProject(value: boolean) {
    this.filterService.updateProjects(this.projects, value, this.projectsNone);
  }
}
