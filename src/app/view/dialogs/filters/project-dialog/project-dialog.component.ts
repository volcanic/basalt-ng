import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styles: [require('./project-dialog.component.scss')],
})
export class ProjectDialogComponent implements OnInit {
  dialogTitle = '';
  projects = [];

  constructor(public dialogRef: MatDialogRef<ProjectDialogComponent>,
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
