import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import 'rxjs/add/observable/from';
import {Media} from 'app/core/ui/model/media.enum';
import {Scope} from 'app/core/entity/model/scope.enum';

/**
 * Displays timeline toolbar
 */
@Component({
  selector: 'app-tasklet-toolbar',
  templateUrl: './tasklet-toolbar.component.html',
  styleUrls: ['./tasklet-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskletToolbarComponent {

  /** Title displayed in the toolbar */
  @Input() title;
  /** Current media */
  @Input() media: Media;
  /** Current scope */

  /** Event emitter indicating menu items being clicked */
  @Output() menuItemEventEmitter = new EventEmitter<string>();

  /** Enum for media types */
  mediaType = Media;
  /** Scope type enum */
  scopeType = Scope;

  //
  // Actions
  //

  /** Handles click on menu item
   * @param {string} menuItem
   */
  onMenuItemClicked(menuItem: string): void {
    this.menuItemEventEmitter.emit(menuItem);
  }
}
