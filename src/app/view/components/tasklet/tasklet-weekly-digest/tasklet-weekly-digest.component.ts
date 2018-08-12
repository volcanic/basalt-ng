import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DigestService} from '../../../../services/entities/digest/digest.service';
import {TaskletWeeklyDigest} from '../../../../model/entities/digest/tasklet-weekly-digest.model';
import {WeeklyDigest} from '../../../../model/entities/digest/weekly-digest.model';

@Component({
  selector: 'app-tasklet-weekly-digest',
  templateUrl: './tasklet-weekly-digest.component.html',
  styleUrls: ['./tasklet-weekly-digest.component.scss']
})
export class TaskletWeeklyDigestComponent implements OnInit {
  @Input() tasklet: TaskletWeeklyDigest;

  weeklyDigest: WeeklyDigest;

  constructor(public dialog: MatDialog,
              private digestService: DigestService) {
  }

  ngOnInit() {
    this.weeklyDigest = this.digestService.getWeeklyDigest(this.tasklet.focusDate);
  }
}
