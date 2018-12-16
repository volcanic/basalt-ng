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
  /** Tags that are currently filtered */
  @Input() tagsFiltered: Tag[] = [];
  /** Tags that are unused */
  @Input() unusedTags: Tag[] = [];
  /** Number of items to be shown initially **/
  @Input() recentCount: number;
  /** Current media */
  @Input() media: Media;
  /** Event emitter indicating tag action */
  @Output() tagEventEmitter = new EventEmitter<{ action: Action, tag: Tag, tags?: Tag[] }>();

  /** Recent tags */
  tagsRecent = [];
  /** Non-recent tags */
  tagsNonRecent = [];

  /** Shows more if true */
  showMoreStatus = false;
  /** Label of more button */
  showMoreLabel = 'More';

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-changes lifecycle phase
   * @param changes changes
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

  /**
   * Handles click on remove-unused-tags button
   */
  onRemoveUnusedTagsClicked() {
    this.tagEventEmitter.emit({action: Action.OPEN_DIALOG_REMOVE_UNUSED, tag: null, tags: this.unusedTags });
  }

  //
  // Helpers
  //

  /**
   * Determines whether a tag in focus due to filter
   * @param tag tag
   */
  isInFocus(tag: Tag) {
    return this.tagsFiltered.length === 0 || this.tagsFiltered.some(t => {
      return tag != null && t != null && t.name === tag.name;
    });
  }
}
