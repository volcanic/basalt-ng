import {Component, HostListener, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Task} from '../../../../../core/entity/model/task.model';
import {Animations} from './task-tooltip.animation';

@Component({
  selector: 'app-task-tooltip',
  templateUrl: './task-tooltip.component.html',
  styleUrls: ['./task-tooltip.component.scss'],
  animations: [Animations.actionAnimation]
})
export class TaskTooltipComponent implements OnChanges {

  @Input() task: Task;
  @Input() ref: any;
  @Input() position: string;

  cssClass = '';

  ngOnChanges(changes: SimpleChanges): void {
    switch (this.position) {
      case 'left': {
        this.cssClass = 'position-left';
        break;
      }
      case 'top': {
        this.cssClass = 'position-top';
        break;
      }
      case 'right': {
        this.cssClass = 'position-right';
        break;
      }
      case 'bottom': {
        this.cssClass = 'position-bottom';
        break;
      }
      default: {
        this.cssClass = 'position-top';
      }
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    // update position based on `ref`
  }
}
