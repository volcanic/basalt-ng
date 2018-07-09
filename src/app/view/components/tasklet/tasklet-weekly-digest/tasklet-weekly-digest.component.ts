import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {DigestService} from '../../../../services/digest.service';
import {TaskletWeeklyDigest} from '../../../../model/tasklet-weekly-digest.model';
import {WeeklyDigest} from '../../../../model/weekly-digest.model';

@Component({
  selector: 'app-tasklet-weekly-digest',
  templateUrl: './tasklet-weekly-digest.component.html',
  styles: [require('./tasklet-weekly-digest.component.scss')]
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
