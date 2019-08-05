import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Action} from 'app/core/entity/model/action.enum';
import {Tag} from '../../../../../core/entity/model/tag.model';
import {Media} from '../../../../../core/ui/model/media.enum';
import {TagService} from '../../../../../core/entity/services/tag/tag.service';

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

  /** Map of tags */
  @Input() tagsMap = new Map<string, Tag>();
  /** Map of tags used for filtering */
  @Input() tagsMapFilter = new Map<string, Tag>();
  /** Map of unused tags */
  @Input() tagsMapUnused = new Map<string, Tag>();
  /** Number of items to be shown initially */
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
    this.initializeTags();
  }

  //
  // Initialization
  //

  /**
   * Initializes tags
   */
  private initializeTags() {
    if (this.tagsMap != null) {
      const tags = Array.from(this.tagsMap.values())
        .sort(TagService.sortTagsByName)
        .sort(TagService.sortTagsByModificationDate);

      if (tags != null) {
        this.tagsRecent = tags.slice(0, this.recentCount);
        if (tags.length > this.recentCount) {
          this.tagsNonRecent = tags.slice(this.recentCount, tags.length - 1).sort((p1, p2) => {
            return p2.name < p1.name ? 1 : -1;
          });
        }
      }
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
   * Handles toggling of more/less button
   */
  onMoreLessToggled() {
    this.showMoreStatus = !this.showMoreStatus;
    this.showMoreLabel = this.showMoreStatus ? 'Less' : 'More';
  }

  /**
   * Handles click on placeholder
   */
  onPlaceholderClicked() {
    // this.tagEventEmitter.emit({action: Action.OPEN_DIALOG_ADD, tag: null});
  }

  /**
   * Handles click on remove-unused-tags button
   */
  onRemoveUnusedTagsClicked() {
    this.tagEventEmitter.emit({action: Action.OPEN_DIALOG_REMOVE_UNUSED, tag: null, tags: Array.from(this.tagsMapUnused.values())});
  }

  //
  // Helpers
  //

  /**
   * Determines whether a tag in focus due to filter
   * @param tag tag
   */
  isInFocus(tag: Tag) {
    return this.tagsMapFilter.size === 0 || Array.from(this.tagsMapFilter.values()).some(t => {
      return tag != null && t != null && t.name === tag.name;
    });
  }
}
