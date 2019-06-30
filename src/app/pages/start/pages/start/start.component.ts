import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';

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
  title = environment.APP_NAME;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
  }
}
