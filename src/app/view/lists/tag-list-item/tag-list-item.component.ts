import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {TagService} from '../../../services/entities/tag.service';
import {Tag} from '../../../model/entities/tag.model';

@Component({
  selector: 'app-tag-list-item',
  templateUrl: './tag-list-item.component.html',
  styleUrls: ['./tag-list-item.component.scss']
})
export class TagListItemComponent implements OnInit {
  @Input() tag: Tag;

  state = 'inactive';

  constructor(private tagService: TagService,
              private filterService: FilterService,
              public dialog: MatDialog,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }

  updateTag() {
    /*
    const dialogRef = this.dialog.open(TagDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.UPDATE,
        dialogTitle: 'Update tag',
        tag: this.tag
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const tag = result as Tag;

        this.tagService.updateTag(tag, true).then(() => {
          this.changeDetector.markForCheck();
        });
        this.filterService.updateTagsList([tag], true);
      }
    });
    */
  }
}
