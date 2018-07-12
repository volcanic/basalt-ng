import {Component, Inject, OnInit} from '@angular/core';
import {Project} from '../../../../model/entities/project.model';
import {DateService} from '../../../../services/date.service';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

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

  inputDisabled = false;

  constructor(public dateService: DateService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<ProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.project = JSON.parse(JSON.stringify(this.data.project));
  }

  //
  // Action buttons
  //

  addProject() {
    this.dialogRef.close(this.project);
  }

  updateProject() {
    this.dialogRef.close(this.project);
  }

  private onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      this.updateProject();
    }
  }
}
