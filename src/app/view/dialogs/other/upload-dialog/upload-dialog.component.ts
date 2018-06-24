import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Subject} from 'rxjs';
import {DropResult, SUCCESS} from '../../../components/file-drop/file-drop.component';
import {SnackbarService} from '../../../../services/snackbar.service';
import {Entity} from '../../../../model/entities/entity.model';
import {EntityService} from '../../../../services/entities/entity.service';
import {ProjectService} from '../../../../services/entities/project.service';
import {Project} from '../../../../model/entities/project.model';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {
  dialogTitle = '';
  dropContent: Subject<Project[]> = new Subject();

  constructor(private projectService: ProjectService,
              private snackbarService: SnackbarService,
              public dialogRef: MatDialogRef<UploadDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.dialogTitle = this.data.title;

    this.dropContent.asObservable().subscribe((result) => {
      (result as Project[]).forEach(e => {
        e['_rev'] = null;
        e['_id'] = null;
        console.log(`DEBUG entity ${JSON.stringify(e)}`);
        this.projectService.updateProject(e);
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
