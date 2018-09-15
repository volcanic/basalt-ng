import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Tasklet} from '../../../../core/entity/model/tasklet.model';

/**
 * Displays calendar item
 */
@Component({
  selector: 'app-calendar-item',
  templateUrl: './calendar-item.component.html',
  styleUrls: ['./calendar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarItemComponent {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;
}
