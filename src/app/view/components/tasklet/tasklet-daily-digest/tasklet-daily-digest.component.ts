import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DailyDigest} from '../../../../model/daily-digest.model';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DigestService} from '../../../../services/digest.service';
import {Tasklet} from '../../../../model/entities/tasklet.model';

@Component({
  selector: 'app-tasklet-daily-digest',
  templateUrl: './tasklet-daily-digest.component.html',
  styleUrls: ['./tasklet-daily-digest.component.scss']
})
export class TaskletDailyDigestComponent implements OnInit {

  @Input() tasklet: Tasklet;
  @Output() actionFiredEmitter = new EventEmitter<string>();

  dailyDigest: DailyDigest;

  constructor(public dialog: MatDialog,
              private digestService: DigestService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_edit_black_18px.svg'));
  }

  ngOnInit() {
    this.dailyDigest = this.digestService.getDailyDigest(new Date(this.tasklet.creationDate));
  }
}
