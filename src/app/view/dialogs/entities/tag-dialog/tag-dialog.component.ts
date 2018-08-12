import {Component, Inject, OnInit} from '@angular/core';
import {FilterService} from '../../../../services/entities/filter/filter.service';
import {ConfirmationDialogComponent} from '../../other/confirmation-dialog/confirmation-dialog.component';
import {DateService} from '../../../../services/util/date.service';
import {Tag} from '../../../../model/entities/tag.model';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {InformationDialogComponent} from '../../other/information-dialog/information-dialog.component';
import {DIALOG_MODE} from '../../../../model/ui/dialog-mode.enum';
import {TagService} from '../../../../services/entities/tag.service';
import {TaskService} from '../../../../services/entities/task.service';
import {CloneService} from '../../../../services/util/clone.service';
import {TaskletService} from '../../../../services/entities/tasklet.service';

@Component({
  selector: 'app-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styleUrls: ['./tag-dialog.component.scss']
})
export class TagDialogComponent implements OnInit {

  DIALOG_MODE: typeof DIALOG_MODE = DIALOG_MODE;

  mode = DIALOG_MODE.NONE;
  dialogTitle = '';
  tag: Tag;

  inputDisabled = false;

  constructor(private tagService: TagService,
              private taskService: TaskService,
              private taskletService: TaskletService,
              private dateService: DateService,
              private filterService: FilterService,
              private cloneService: CloneService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<TagDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;

    // Deep copy
    this.tag = this.cloneService.cloneTag(this.data.tag);
  }

  //
  // Action
  //

  public onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      this.updateTag();
    }
  }

  //
  // Buttons action
  //

  addTag() {
    this.dialogRef.close(this.tag);
  }

  updateTag() {
    this.dialogRef.close(this.tag);
  }

  deleteTag() {

    const taskReferences = Array.from(this.taskService.tasks.values()).some(t => {
      return t.tagIds.some(tagId => {
        return tagId === this.tag.id;
      });
    });

    const taskletReferences = Array.from(this.taskletService.tasklets.values()).some(t => {
      return t.tagIds.some(tagId => {
        return tagId === this.tag.id;
      });
    });

    if (taskReferences || taskletReferences) {
      this.dialog.open(InformationDialogComponent, <MatDialogConfig>{
        disableClose: false,
        data: {
          title: 'Cannot delete tag',
          text: `There are still tasks and/oro tasklets associated with this tag.`,
          action: 'Okay',
          value: this.tag
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
        disableClose: false,
        data: {
          title: 'Delete tag',
          text: 'Do you want to delete this tag?',
          action: 'Delete',
          value: this.tag
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.tagService.deleteTag(result as Tag);
          this.filterService.tags.delete((result as Tag).id); // Delete tag from filter list
          this.dialogRef.close(null);
        }
      });
    }
  }
}
