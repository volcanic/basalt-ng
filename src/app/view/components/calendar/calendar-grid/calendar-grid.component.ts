import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Tasklet} from '../../../../model/entities/tasklet.model';
import {MatchService} from '../../../../services/entities/filter/match.service';

/**
 * Displays calender grid
 */
@Component({
  selector: 'app-calendar-grid',
  templateUrl: './calendar-grid.component.html',
  styleUrls: ['./calendar-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarGridComponent implements OnChanges {

  /** Focus day to be displayed */
  @Input() focusDay = new Date();
  /** Array of tasklets */
  @Input() tasklets: Tasklet[] = [];

  /** Tasklets that match focus day */
  filteredTasklets: Tasklet[] = [];

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-changes lifecycle hook
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.filteredTasklets = this.tasklets.filter(tasklet => {
      MatchService.taskletMatchesDate(tasklet, new Date(this.focusDay));
    });
  }
}
