import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {ProjectService} from '../../../../services/entities/project.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Project} from '../../../../model/entities/project.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {

  projects = [];

  private projectsUnsubscribeSubject = new Subject();

  constructor(private projectService: ProjectService) {
  }

  ngOnInit() {

    // Subscribe project changes
    this.projectService.projectsSubject.pipe(
      takeUntil(this.projectsUnsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.projects = (value as Project[]);
      }
    });
  }

  ngOnDestroy(): void {
    this.projectsUnsubscribeSubject.next();
    this.projectsUnsubscribeSubject.complete();
  }
}
