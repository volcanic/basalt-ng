import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../../../../core/notification/services/notification.service';
import {environment} from '../../../../../environments/environment';

/**
 * Displays notification page
 */
@Component({
  selector: 'app-notfication',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  /** App title */
  title = environment.APP_NAME;

  /**
   * Constructor
   * @param notificationService notification service
   */
  constructor(private notificationService: NotificationService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
  }

  //
  // Actions
  //

  /**
   * Handles click on request-permission button
   */
  requestPermissionNotificationClicked() {
    this.notificationService.requestPermission();
  }

  /**
   * Handles click on show-notification button
   */
  showNotificationButtonClicked() {
    this.notificationService.displayNotification('Hello Amphibian', 'This is a notification', 'icon-96x96.png');
  }
}
