import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {DigestService} from '../../../../services/digest.service';
import {TaskletWeeklyDigest} from '../../../../model/tasklet-weekly-digest.model';
import {DailyDigest} from '../../../../model/daily-digest.model';

@Component({
  selector: 'app-tasklet-weekly-digest',
  templateUrl: './tasklet-weekly-digest.component.html',
  styles: [require('./tasklet-weekly-digest.component.scss')]
})
export class TaskletWeeklyDigestComponent implements OnInit {
  @Input() tasklet: TaskletWeeklyDigest;
  @Output() onActionFired = new EventEmitter<string>();

  weekStart: Date;
  weekEnd: Date;

  weeklyDigest: DailyDigest[];

  constructor(public dialog: MatDialog,
              private digestService: DigestService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_edit_black_18px.svg'));
  }

  ngOnInit() {
    this.weekStart = DigestService.getWeekStart(this.tasklet.focusDate);
    this.weekEnd = DigestService.getWeekEnd(this.tasklet.focusDate);

    this.weeklyDigest = this.digestService.getWeeklyDigest(this.tasklet.focusDate);
  }
}
