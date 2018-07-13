import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {QuarterHour} from '../../../../model/quarterhour.model';
import {DigestService} from '../../../../services/digest.service';
import {DateService} from '../../../../services/date.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {Tasklet} from '../../../../model/entities/tasklet.model';
import {TaskletService} from '../../../../services/entities/tasklet.service';

@Component({
  selector: 'app-calendar-grid-day',
  templateUrl: './calendar-grid-day.component.html',
  styleUrls: ['./calendar-grid-day.component.scss']
})
export class CalendarGridDayComponent implements OnInit, OnDestroy {
  @Input() focusDay = new Date();
  tasklets = [];
  private taskletsUnsubscribeSubject = new Subject();

  weekDay = '';
  date = '';
  quarterHours = [];

  DISPLAY_LIMIT = 100;

  constructor(private dateService: DateService,
              private taskletService: TaskletService,
              private digestService: DigestService) {
  }

  ngOnInit() {
    // Subscribe tasklet changes
    this.taskletService.taskletsSubject.pipe(
      takeUntil(this.taskletsUnsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.tasklets = value.sort((t1: Tasklet, t2: Tasklet) => {
          const date1 = new Date(t1.creationDate).getTime();
          const date2 = new Date(t2.creationDate).getTime();

          return date2 - date1;
        }).filter(t => {
          this.taskletService.matchesDate(t, new Date(this.focusDay));
        }).slice(0, this.DISPLAY_LIMIT);
      } else {
        this.tasklets = [];
      }
    });

    this.taskletService.notify();

    this.weekDay = this.dateService.getWeekDayString(this.focusDay.getDay());
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

  ngOnDestroy(): void {
    this.taskletsUnsubscribeSubject.next();
    this.taskletsUnsubscribeSubject.complete();
  }
}
