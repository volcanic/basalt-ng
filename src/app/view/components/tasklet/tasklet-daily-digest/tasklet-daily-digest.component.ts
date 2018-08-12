import {Component, Input, OnInit} from '@angular/core';
import {DailyDigest} from '../../../../model/entities/digest/daily-digest.model';
import {MatDialog} from '@angular/material';
import {DigestService} from '../../../../services/entities/digest/digest.service';
import {Tasklet} from '../../../../model/entities/tasklet.model';

@Component({
  selector: 'app-tasklet-daily-digest',
  templateUrl: './tasklet-daily-digest.component.html',
  styleUrls: ['./tasklet-daily-digest.component.scss']
})
export class TaskletDailyDigestComponent implements OnInit {

  @Input() tasklet: Tasklet;

  dailyDigest: DailyDigest;

  constructor(public dialog: MatDialog,
              private digestService: DigestService) {
  }

  ngOnInit() {
    this.dailyDigest = this.digestService.getDailyDigest(new Date(this.tasklet.creationDate));
  }
}
