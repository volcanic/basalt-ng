import {Directive, ElementRef, HostListener, Input, OnDestroy} from '@angular/core';
import {TooltipService} from '../../../core/ui/services/tooltip.service';
import {Task} from '../../../core/entity/model/task.model';

@Directive({
  selector: '[appTaskTooltip]'
})
export class TaskTooltipDirective implements OnDestroy {

  /** Task to be displayed */
  @Input() task: Task;
  @Input() position: '';

  constructor(private tooltipService: TooltipService, private element: ElementRef) {
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.tooltipService.tooltipTask = this.task;
    this.tooltipService.tooltipTaskRef = this.element;
    this.tooltipService.tooltipTaskPosition = this.position;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroy();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    this.tooltipService.tooltipTask = null;
    this.tooltipService.tooltipTaskRef = null;
    this.tooltipService.tooltipTaskPosition = null;
  }
}
