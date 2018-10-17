import {Component, OnInit} from '@angular/core';
import {TimelineComponent} from '../timeline/timeline.component';
import {TaskletComponent} from '../tasklet/tasklet.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  currentComponent: typeof TimelineComponent | typeof TaskletComponent;

  constructor(public router: Router) {
  }

  ngOnInit() {
    if (this.router.url === '/timeline') {
      this.currentComponent = TimelineComponent;
    } else if (this.router.url === '/tasklet') {
      this.currentComponent = TaskletComponent;
    }
  }
}
