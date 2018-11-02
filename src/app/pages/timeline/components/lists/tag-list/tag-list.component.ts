import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Action} from 'app/core/entity/model/action.enum';
import {Tag} from '../../../../../core/entity/model/tag.model';
import {Media} from '../../../../../core/ui/model/media.enum';

/**
 * Displays tag list
 */
@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListComponent implements OnChanges {

  /** Tags to be displayed */
  @Input() tags = [];
  /** Number of items to be shown initially **/
  @Input() recentCount: number;
  /** Current media */
  @Input() media: Media;
  /** Event emitter indicating tag action */
  @Output() tagEventEmitter = new EventEmitter<{ action: Action, tag: Tag }>();

  /** Recent tags */
  tagsRecent = [];
  /** Non-recent tags */
  tagsNonRecent = [];

  showMoreStatus = false;
  showMoreLabel = 'More';

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-changes lifecycle phase
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.tagsRecent = this.tags.slice(0, this.recentCount);
    if (this.tags.length > this.recentCount) {
      this.tagsNonRecent = this.tags.slice(this.recentCount, this.tags.length - 1).sort((p1, p2) => {
        return p2.name < p1.name ? 1 : -1;
      });
    }
  }

  //
  // Action
  //

  /**
   * Handles tag event
   * @param event event
   */
  onTagEvent(event: any) {
    this.tagEventEmitter.emit(event);
  }

  /**
   * Handles click on add button
   */
  onAddClicked() {
    this.tagEventEmitter.emit({action: Action.OPEN_DIALOG_ADD, tag: null});
  }

  /**
   * Handles toggling of more/less button
   */
  onMoreLessToggled() {
    this.showMoreStatus = !this.showMoreStatus;
    this.showMoreLabel = this.showMoreStatus ? 'Less' : 'More';
  }
}
