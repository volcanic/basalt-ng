import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-tag-filter-dialog',
  templateUrl: './tag-filter-dialog.component.html',
  styles: [require('./tag-filter-dialog.component.scss')],
})
export class TagFilterDialogComponent implements OnInit {
  dialogTitle = '';
  tags = [];
  tagsNone = false;

  constructor(public dialogRef: MatDialogRef<TagFilterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogTitle = data.dialogTitle;
    this.tags = this.data.tags.sort((t1, t2) => {
      return t1.name > t2.name ? 1 : -1;
    });
    this.tagsNone = this.data.tagsNone;
  }

  ngOnInit() {
  }

  selectAll() {
    this.tags.forEach(t => {
      t.checked = true;
    });
  }

  selectNone() {
    this.tags.forEach(t => {
      t.checked = false;
    });
  }

  apply() {
    this.dialogRef.close({tags: this.tags, tagsNone: this.tagsNone});
  }
}
