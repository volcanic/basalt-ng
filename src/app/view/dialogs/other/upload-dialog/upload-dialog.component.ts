import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Subject} from 'rxjs';
import {DropResult, SUCCESS} from '../../../components/file-drop/file-drop.component';
import {SnackbarService} from '../../../../services/snackbar.service';
import {Entity} from '../../../../model/entities/entity.model';
import {ProjectService} from '../../../../services/entities/project.service';
import {Project} from '../../../../model/entities/project.model';
import {TaskService} from '../../../../services/entities/task.service';
import {EntityType} from '../../../../model/entities/entity-type.enum';
import {TaskletService} from '../../../../services/entities/tasklet.service';
import {Task} from '../../../../model/entities/task.model';
import {Tasklet} from '../../../../model/entities/tasklet.model';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {
  dialogTitle = '';
  dropContent: Subject<Project[]> = new Subject();

  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private taskletService: TaskletService,
              private snackbarService: SnackbarService,
              public dialogRef: MatDialogRef<UploadDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.dialogTitle = this.data.title;

    this.dropContent.asObservable().subscribe((result) => {
      (result as Entity[]).forEach(entity => {
        entity['_rev'] = null;
        entity['_id'] = null;

        const entityType = (entity as Entity).entityType;

        if (entityType === EntityType.PROJECT) {
          this.projectService.updateProject(entity as Project);
        } else if (entityType === EntityType.TASK) {
          this.taskService.updateTask(entity as Task);
        } else if (entityType === EntityType.TASKLET) {
          this.taskletService.updateTasklet(entity as Tasklet);
        }
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
