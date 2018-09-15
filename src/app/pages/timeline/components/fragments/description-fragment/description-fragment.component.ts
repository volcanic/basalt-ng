import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Description} from 'app/core/entity/model/description.model';

/**
 * Displays description fragment
 */
@Component({
  selector: 'app-description-fragment',
  templateUrl: './description-fragment.component.html',
  styleUrls: ['./description-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DescriptionFragmentComponent {

  /** Description of to be displayed */
  @Input() description: Description = new Description();
  /** Whether component is readonly or not */
  @Input() readonly = false;

  /** Event emitter indicating changes in description */
  @Output() descriptionChangedEmitter = new EventEmitter<Description>();

  //
  // Actions
  //

  /**
   * Handles click on clear button
   */
  onClearButtonClicked() {
    this.description.value = '';
  }

  /**
   * Handles changes in description text
   */
  onDescriptionTextChanged() {
    this.descriptionChangedEmitter.emit(this.description);
  }
}
