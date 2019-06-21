import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../../core/notification/services/notification.service';

/**
 * Displays start page
 */
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  /** App title */
  title = 'basalt-ng';

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
  }
}
