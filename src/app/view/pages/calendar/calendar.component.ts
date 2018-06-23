import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskletsService} from '../../../services/tasklets.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Tasklet} from '../../../model/tasklet.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  focusDay = new Date();

  constructor() {
  }

  ngOnInit() {
  }

}
