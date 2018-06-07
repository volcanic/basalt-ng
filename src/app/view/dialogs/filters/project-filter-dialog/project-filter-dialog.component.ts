import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Project} from '../../../../model/project.model';

@Component({
  selector: 'app-project-filter-dialog',
  templateUrl: './project-filter-dialog.component.html',
  styles: [require('./project-filter-dialog.component.scss')],
})
export class ProjectsFilterDialogComponent implements OnInit {
  dialogTitle = '';
  projects: Project[] = [];

  constructor(public dialogRef: MatDialogRef<ProjectsFilterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_black_24px.svg'));

    this.dialogTitle = data.dialogTitle;

    this.projects = this.data.projects.sort((p1, p2) => {
      return p1.value > p2.value ? 1 : -1;
    });
  }

  ngOnInit() {
  }

  selectAll() {
    this.projects.forEach(p => {
      p.checked = true;
    });
  }

  selectNone() {
    this.projects.forEach(p => {
      p.checked = false;
    });
  }

  apply() {
    this.dialogRef.close(this.projects);
  }
}
