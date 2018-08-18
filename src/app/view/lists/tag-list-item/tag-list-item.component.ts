import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {TagService} from '../../../services/entities/tag.service';
import {Tag} from '../../../model/entities/tag.model';
import {DialogMode} from '../../../model/ui/dialog-mode.enum';
import {TagDialogComponent} from '../../dialogs/entities/tag-dialog/tag-dialog.component';

/**
 * Displays tag list item
 */
@Component({
  selector: 'app-tag-list-item',
  templateUrl: './tag-list-item.component.html',
  styleUrls: ['./tag-list-item.component.scss']
})
export class TagListItemComponent {

  /** Tag to be rendered*/
  @Input() tag: Tag;

  /** Animation state */
  state = 'inactive';

  /**
   * Constructor
   * @param {TagService} tagService
   * @param {FilterService} filterService
   * @param {ChangeDetectorRef} changeDetector
   * @param {MatDialog} dialog dialog
   */
  constructor(private tagService: TagService,
              private filterService: FilterService,
              private changeDetector: ChangeDetectorRef,
              public dialog: MatDialog) {
  }

//
// Actions
//

  /**
   * Handles hover over container
   * @param {boolean} hovered whether there is currently a hover event
   */
  onHoverContainer(hovered
                     :
                     boolean
  ) {
    this.state = hovered ? 'active' : 'inactive';
  }

//
// Button actions
//

  /**
   * Handles click on update button
   */
  updateTag() {
    const dialogRef = this.dialog.open(TagDialogComponent, {
      disableClose: false,
      data: {
        mode: DialogMode.UPDATE,
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
  }
}
