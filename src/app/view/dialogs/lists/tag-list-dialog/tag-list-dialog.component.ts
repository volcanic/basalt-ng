import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {TagDialogComponent} from '../../entities/tag-dialog/tag-dialog.component';
import {DialogMode} from '../../../../model/ui/dialog-mode.enum';
import {FilterService} from '../../../../services/entities/filter/filter.service';
import {Tag} from '../../../../model/entities/tag.model';
import {TagService} from '../../../../services/entities/tag.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';

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

  /**
   * Constructor
   * @param {TagService} tagService
   * @param {FilterService} filterService
   * @param {ChangeDetectorRef} changeDetector
   * @param {MatDialog} dialog dialog
   * @param data dialog data
   */
  constructor(private tagService: TagService,
              private filterService: FilterService,
              private changeDetector: ChangeDetectorRef,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogTitle = data.dialogTitle;
  }

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'add-tag': {
        const dialogRef = this.dialog.open(TagDialogComponent, {
          disableClose: false,
          data: {
            mode: DialogMode.ADD,
            dialogTitle: 'Add tag',
            tag: new Tag('', true)
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const tag = result as Tag;
            this.filterService.updateTagsList([tag], true);
            this.tagService.createTag(tag).then(() => {
              this.changeDetector.markForCheck();
            });
          }
        });
        break;
      }
    }
  }
}

