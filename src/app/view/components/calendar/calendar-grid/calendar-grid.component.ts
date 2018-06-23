import {Component, Input, OnInit} from '@angular/core';
import {DigestService} from '../../../../services/digest.service';
import {TaskletsService} from '../../../../services/tasklets.service';

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
