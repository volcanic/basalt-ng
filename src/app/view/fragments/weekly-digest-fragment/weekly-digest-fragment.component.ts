import {Component, Input, OnInit} from '@angular/core';
import {TaskletWeeklyDigest} from '../../../model/tasklet-weekly-digest.model';

@Component({
  selector: 'app-weekly-digest-fragment',
  templateUrl: './weekly-digest-fragment.component.html',
  styleUrls: ['./weekly-digest-fragment.component.scss']
})
export class WeeklyDigestFragmentComponent implements OnInit {
  @Input() tasklet: TaskletWeeklyDigest;

  constructor() {
  }

  ngOnInit() {
  }
}
