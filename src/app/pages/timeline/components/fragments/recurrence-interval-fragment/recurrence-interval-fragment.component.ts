import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {RecurrenceInterval} from '../../../../../core/entity/model/recurrence-interval.enum';

/**
 * Displays recurrence interval fragment
 */
@Component({
  selector: 'app-recurrence-interval-fragment',
  templateUrl: './recurrence-interval-fragment.component.html',
  styleUrls: ['./recurrence-interval-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecurrenceIntervalFragmentComponent {

  /** Recurrence interval to be displayed */
  @Input() recurrenceInterval: RecurrenceInterval;
  /** Event emitter indicating changes in recurrence interval */
  @Output() recurrenceIntervalChangedEmitter = new EventEmitter<RecurrenceInterval>();

  /** Available recurrence intervals */
  recurrenceIntervals = Object.keys(RecurrenceInterval).map(key => RecurrenceInterval[key]);

  /** Reference to static method */
  selectIcon = RecurrenceIntervalFragmentComponent.selectIcon;

  /**
   * Retrieves an icon by tasklet type
   * @param recurrenceInterval recurrence interval
   */
  static selectIcon(recurrenceInterval: RecurrenceInterval) {
    switch (recurrenceInterval) {
      case RecurrenceInterval.NONE: {
        return 'today';
      }
      case RecurrenceInterval.DAILY:
      case RecurrenceInterval.MONTHLY:
      case RecurrenceInterval.WEEKLY: {
        return 'loop';
      }
    }
  }

  //
  // Actions
  //

  onSelectionChanged() {
    this.recurrenceIntervalChangedEmitter.emit(this.recurrenceInterval);
  }
}
