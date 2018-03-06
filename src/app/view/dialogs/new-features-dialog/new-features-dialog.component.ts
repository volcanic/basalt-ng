import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-new-features-dialog',
  templateUrl: './new-features-dialog.component.html',
  styleUrls: ['./new-features-dialog.component.scss']
})
export class NewFeaturesDialogComponent implements OnInit {
  dialogTitle = '';
  gitTags = [];

  constructor(public dialogRef: MatDialogRef<NewFeaturesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.dialogTitle = this.data.dialogTitle;
    this.gitTags = this.data.gitTags;
    this.gitTags.forEach(gt => {
      gt.annotation = gt.annotation.replace(/.*v/g, '');
    });
  }
}
