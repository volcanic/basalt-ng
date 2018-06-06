import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {FormControl} from '@angular/forms';
import {Project} from '../../../../model/project.model';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {

  DIALOG_MODE: typeof DIALOG_MODE = DIALOG_MODE;

  mode = DIALOG_MODE.NONE;
  dialogTitle = '';
  project: Project;

  formControl: FormControl = new FormControl();

  constructor(public dialogRef: MatDialogRef<ProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.project = this.data.project;
  }

  addProject() {
    this.dialogRef.close(this.project);
  }

}
