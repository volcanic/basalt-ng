import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Tasklet} from '../../../../model/tasklet.model';
import {Subject} from 'rxjs';
import {DropResult, SUCCESS} from '../../../components/file-drop/file-drop.component';
import {SnackbarService} from '../../../../services/snackbar.service';
import {TaskletsService} from '../../../../services/tasklets.service';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {
  dialogTitle = '';
  dropContent: Subject<Tasklet[]> = new Subject();

  constructor(private taskletsService: TaskletsService,
              private snackbarService: SnackbarService,
              public dialogRef: MatDialogRef<UploadDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.dialogTitle = this.data.title;

    this.dropContent.asObservable().subscribe((result) => {
      (result as Tasklet[]).forEach(t => {
        t['_rev'] = null;
        t['_id'] = null;
        console.log(`DEBUG tasklet ${JSON.stringify(t)}`);
        this.taskletsService.updateTasklet(t);
      });
    });
  }

  public uploadedFiles(result: DropResult) {
    if (result.result == SUCCESS) {
      this.dropContent.next(result.payload);
    } else {
      this.snackbarService.showSnackbar('ERROR: Failed to parse dropped file.', '');
    }
  }

}
