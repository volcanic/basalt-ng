import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DateService} from '../../../../services/util/date.service';
import {QuarterHour} from '../../../../model/ui/quarterhour.model';

/**
 * Displays calendar grid element for a quarter hour
 */
@Component({
  selector: 'app-calendar-grid-quarter-hour',
  templateUrl: './calendar-grid-quarter-hour.component.html',
  styleUrls: ['./calendar-grid-quarter-hour.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarGridQuarterHourComponent implements OnInit {

  /** Quarter hour to be displayed */
  @Input() quarterHour: QuarterHour;

  /** Start time */
  startTime = '';

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeStartTime();
  }

  //
  // Initialization
  //

  /**
   * Initializes start time
   */
  private initializeStartTime() {
    if (this.quarterHour.start.getMinutes() === 0) {
      this.startTime = DateService.getTimeString(this.quarterHour.start);
    }
  }
}
