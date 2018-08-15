import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {TagDialogComponent} from '../../entities/tag-dialog/tag-dialog.component';
import {DIALOG_MODE} from '../../../../model/ui/dialog-mode.enum';
import {FilterService} from '../../../../services/entities/filter/filter.service';
import {Tag} from '../../../../model/entities/tag.model';
import {TagService} from '../../../../services/entities/tag.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';

@Component({
  selector: 'app-tag-list-dialog',
  templateUrl: './tag-list-dialog.component.html',
  styleUrls: ['./tag-list-dialog.component.scss']
})
export class TagListDialogComponent implements OnInit {

  dialogTitle = '';

  constructor(private tagService: TagService,
              private filterService: FilterService,
              public dialog: MatDialog,
              private changeDetector: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogTitle = data.dialogTitle;
  }

  ngOnInit() {
  }

  /**
   * Handles click on menu items
   * @param menuItem
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'add-tag': {
        const dialogRef = this.dialog.open(TagDialogComponent, {
          disableClose: false,
          data: {
            mode: DIALOG_MODE.ADD,
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

