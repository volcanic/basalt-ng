import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Subject} from 'rxjs';
import {
  DropResult,
  SUCCESS
} from 'app/pages/timeline/components/fragments/other/file-drop-fragment/file-drop-fragment.component';
import {SnackbarService} from 'app/core/ui/services/snackbar.service';
import {Entity} from 'app/core/entity/model/entity.model';
import {ProjectService} from 'app/core/entity/services/project.service';
import {TaskService} from 'app/core/entity/services/task/task.service';
import {TaskletService} from 'app/core/entity/services/tasklet/tasklet.service';
import {EntityService} from 'app/core/entity/services/entity.service';
import {PouchDBService} from 'app/core/persistence/services/pouchdb.service';

/**
 * Displays upload dialog
 */
@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {

  /** Dialog title */
  dialogTitle = '';

  /** Entities retrieved from dropped file */
  dropContent: Subject<Entity[]> = new Subject();

  /**
   * Constructor
   * @param entityService entity service
   * @param projectService project service
   * @param taskService task service
   * @param taskletService tasklet service
   * @param pouchDBService pouchDB service
   * @param snackbarService snackbar service
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private entityService: EntityService,
              private projectService: ProjectService,
              private taskService: TaskService,
              private taskletService: TaskletService,
              private pouchDBService: PouchDBService,
              private snackbarService: SnackbarService,
              public dialogRef: MatDialogRef<UploadDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.dialogTitle = this.data.title;

    this.dropContent.asObservable().subscribe((result) => {
      (result as Entity[]).forEach(entity => {
        entity['_rev'] = null;
        entity['_id'] = null;
      });

      this.pouchDBService.bulk(result as Entity[]);
    });
  }

  //
  // Actions
  //

  /**
   * Handles files dropped into the dropzone
   * @param result drop result
   */
  public onFilesUploaded(result: DropResult) {
    if (result.result.toString().toUpperCase() === SUCCESS) {
      this.dropContent.next(result.payload);
    } else {
      this.snackbarService.showSnackbar('ERROR: Failed to parse dropped file.');
    }
  }
}
