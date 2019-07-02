import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DateService} from '../../../../core/entity/services/date.service';
import {QuarterHour} from '../../../../core/entity/model/quarterhour.model';

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
   * Handles on-init lifecycle phase
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
    if (this.quarterHour != null && this.quarterHour.start.getMinutes() === 0) {
      this.startTime = DateService.getTimeString(this.quarterHour.start);
    }
  }
}
