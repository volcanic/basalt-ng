import {Component, OnInit} from '@angular/core';

/**
 * Displays a task in fullscreen mode
 */
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  /**
   * Constructor
   */
  constructor() {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
  }
}
