import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styles: [require('./tag-dialog.component.scss')],
})
export class TagDialogComponent implements OnInit {
  dialogTitle = '';
  tags = [];

  constructor(public dialogRef: MatDialogRef<TagDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_black_24px.svg'));

    this.dialogTitle = data.dialogTitle;
    this.tags = this.data.tags;
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
    this.dialogRef.close(this.tags);
  }
}
