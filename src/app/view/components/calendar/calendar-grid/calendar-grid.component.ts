import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-calendar-grid',
  templateUrl: './calendar-grid.component.html',
  styleUrls: ['./calendar-grid.component.scss']
})
export class CalendarGridComponent implements OnInit {
  @Input() focusDay = new Date();

  constructor() {
  }

  ngOnInit() {
  }

}
