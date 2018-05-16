import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {DigestService} from '../../../../services/digest.service';
import {TaskletWeeklyDigest} from '../../../../model/tasklet-weekly-digest.model';
import {Tasklet} from '../../../../model/tasklet.model';

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
  tasklets: Tasklet[];

  constructor(public dialog: MatDialog,
              private digestService: DigestService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_edit_black_18px.svg'));
  }

  ngOnInit() {
    this.weekStart = DigestService.getWeekStart(this.tasklet.focusDate);
    this.weekEnd = DigestService.getWeekEnd(this.tasklet.focusDate);
    this.tasklets = this.digestService.getRelevantTasklets(this.tasklet.focusDate);
  }
}
