import { Component, OnInit } from '@angular/core';
import {TooltipService} from '../../../../../core/ui/services/tooltip.service';

@Component({
  selector: 'app-task-tooltip-container',
  templateUrl: './task-tooltip-container.component.html',
  styleUrls: ['./task-tooltip-container.component.scss']
})
export class TaskTooltipContainerComponent implements OnInit {

  constructor(private tooltipService: TooltipService) { }

  ngOnInit() {
  }

}
