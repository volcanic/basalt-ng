import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {TagDialogComponent} from '../../entities/tag-dialog/tag-dialog.component';
import {DialogMode} from '../../../../model/ui/dialog-mode.enum';
import {FilterService} from '../../../../services/entities/filter/filter.service';
import {Tag} from '../../../../model/entities/tag.model';
import {TagService} from '../../../../services/entities/tag.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Task} from '../../../../model/entities/task.model';
import {Action} from '../../../../model/ui/action.enum';
import {ProjectDialogComponent} from '../../entities/project-dialog/project-dialog.component';
import {Project} from '../../../../model/entities/project.model';

/**
 * Displays tag list dialog
 */
@Component({
  selector: 'app-tag-list-dialog',
  templateUrl: './tag-list-dialog.component.html',
  styleUrls: ['./tag-list-dialog.component.scss']
})
export class TagListDialogComponent {

  /** Dialog title */
  dialogTitle = '';
  /** Array of tags to be displayed */
  tags: Tag[];

  /**
   * Constructor
   * @param {MatDialogRef<ProjectDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<ProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.initializeData();
  }

  //
  // Initialization
  //

  /**
   * Initializes data
   */
  private initializeData() {
    this.dialogTitle = this.data.dialogTitle;
    this.tags = this.data.tags;
  }

  //
  // Actions
  //

  /**
   * Handles tag events
   * @param {any} event tag event
   */
  onTagEvent(event: {action: Action, tag: Tag}) {
    this.dialogRef.close(event);
  }
}

