import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {QuarterHour} from '../../../../model/ui/quarterhour.model';
import {DateService} from '../../../../services/util/date.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {Tasklet} from '../../../../model/entities/tasklet.model';
import {TaskletService} from '../../../../services/entities/tasklet.service';
import {MatchService} from '../../../../services/entities/filter/match.service';

/**
 * Displays calendar grid for a day
 */
@Component({
  selector: 'app-calendar-grid-day',
  templateUrl: './calendar-grid-day.component.html',
  styleUrls: ['./calendar-grid-day.component.scss']
})
export class CalendarGridDayComponent implements OnInit, OnDestroy {

  /** Focus day to be displayed */
  @Input() focusDay = new Date();

  /** Array of tasklet */
  tasklets = [];

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** Weekday */
  weekDay = '';
  /** Date */
  date = '';
  /** Array of quarterhours */
  quarterHours = [];

  /**
   * Constructor
   * @param {DateService} dateService
   * @param {TaskletService} taskletService
   * @param {MatchService} matchService
   */
  constructor(private dateService: DateService,
              private taskletService: TaskletService,
              private matchService: MatchService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeTaskletSubscription();
    this.initializeDate();
  }

  /**
   * Handles on-destroy lifecycle hook
   */
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Initialization
  //

  /**
   * Initializes tasklet subscription
   */
  private initializeTaskletSubscription() {
    this.taskletService.taskletsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.tasklets = value.sort((t1: Tasklet, t2: Tasklet) => {
          const date1 = new Date(t1.creationDate).getTime();
          const date2 = new Date(t2.creationDate).getTime();

          return date2 - date1;
        }).filter(t => {
          MatchService.taskletMatchesDate(t, new Date(this.focusDay));
        });
      } else {
        this.tasklets = [];
      }
    });

    this.taskletService.notify();
  }

  /**
   * Initializes date
   */
  private initializeDate() {
    this.weekDay = DateService.getWeekDayString(this.focusDay.getDay());
    this.date = this.focusDay.getDate().toString();

    const dayStart = new Date(this.focusDay).setHours(0, 0, 0, 0);
    let counter = 0;
    while (counter < (24 * 4)) {
      const start = new Date(new Date(dayStart).getTime() + (counter * 15 * 60000));
      const end = new Date(new Date(dayStart).getTime() + ((counter + 1) * 15 * 60000));

      const quaterHour = new QuarterHour();
      quaterHour.start = start;
      quaterHour.end = end;

      this.quarterHours.push(quaterHour);
      counter++;
    }
  }
}
