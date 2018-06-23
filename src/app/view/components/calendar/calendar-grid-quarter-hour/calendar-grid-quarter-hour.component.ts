import {Component, Input, OnInit} from '@angular/core';
import {DateService} from '../../../../services/date.service';
import {QuarterHour} from '../../../../model/quarterhour.model';

@Component({
  selector: 'app-calendar-grid-quarter-hour',
  templateUrl: './calendar-grid-quarter-hour.component.html',
  styleUrls: ['./calendar-grid-quarter-hour.component.scss']
})
export class CalendarGridQuarterHourComponent implements OnInit {
  @Input() quarterHour: QuarterHour;
  startTime = '';

  constructor(private dateService: DateService) {
  }

  ngOnInit() {
    if (this.quarterHour.start.getMinutes() === 0) {
      this.startTime = this.dateService.getTime(this.quarterHour.start);
    }
  }

}
