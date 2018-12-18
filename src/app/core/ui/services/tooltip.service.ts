import {Injectable} from '@angular/core';
import {Task} from '../../entity/model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

  tooltipTask: Task;
  tooltipTaskRef: any;
  tooltipTaskPosition: string;

  constructor() {
  }
}
