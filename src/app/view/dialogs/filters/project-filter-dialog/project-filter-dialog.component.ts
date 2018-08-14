import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Project} from '../../../../model/entities/project.model';
import {CloneService} from '../../../../services/util/clone.service';

@Component({
  selector: 'app-project-filter-dialog',
  templateUrl: './project-filter-dialog.component.html',
  styleUrls: ['./project-filter-dialog.component.scss'],
})
export class ProjectFilterDialogComponent implements OnInit {
  dialogTitle = '';
  projects: Project[] = [];
  projectsNone = false;

  constructor(private cloneService: CloneService,
              public dialogRef: MatDialogRef<ProjectFilterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.dialogTitle = data.dialogTitle;

    this.projects = this.cloneService.cloneProjects(this.data.projects).sort((p1, p2) => {
      return p1.name > p2.name ? 1 : -1;
    });
    this.projectsNone = this.data.projectsNone;
  }

  ngOnInit() {
  }

  selectAll() {
    this.projects.forEach(p => {
      p.checked = true;
    });
    this.projectsNone = true;
  }

  selectNone() {
    this.projects.forEach(p => {
      p.checked = false;
    });
    this.projectsNone = false;
  }

  apply() {
    this.dialogRef.close({projects: this.projects, projectsNone: this.projectsNone});
  }
}
