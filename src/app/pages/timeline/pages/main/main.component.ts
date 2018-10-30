import {Component, OnInit} from '@angular/core';
import {TimelineComponent} from '../timeline/timeline.component';
import {TaskletComponent} from '../tasklet/tasklet.component';
import {Router} from '@angular/router';

/**
 * Wraps timeline and tasklet page
 */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  /** Component currently displayed */
  currentComponent: typeof TimelineComponent | typeof TaskletComponent;

  /**
   * Constructor
   * @param router router
   */
  constructor(public router: Router) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    if (this.router.url.startsWith('/timeline')) {
      this.currentComponent = TimelineComponent;
    } else if (this.router.url.startsWith('/tasklet')) {
      this.currentComponent = TaskletComponent;
    }
  }
}
