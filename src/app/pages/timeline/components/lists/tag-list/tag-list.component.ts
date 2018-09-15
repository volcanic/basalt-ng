import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Action} from 'app/core/entity/model/action.enum';

/**
 * Displays tag list
 */
@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListComponent {

  /** Tags to be displayed */
  @Input() tags = [];
  /** Event emitter indicating tag action */
  @Output() tagEventEmitter = new EventEmitter<{ Action, Tag }>();

  /** Enum for action types */
  action = Action;
}
