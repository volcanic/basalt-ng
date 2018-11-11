import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Task} from '../../../../../../core/entity/model/task.model';

@Component({
  selector: 'app-task-title-form',
  templateUrl: './task-title-form.component.html',
  styleUrls: ['./task-title-form.component.scss']
})
export class TaskTitleFormComponent {

  /** Task to be displayed */
  @Input() task: Task;
  /** Readonly dialog if true */
  @Input() readonly = false;

  /** Event emitter indicating task changes */
  @Output() taskEventEmitter = new EventEmitter<{ task: Task }>();

  //
  // Actions
  //

  // Name

  /**
   * Handles names changes
   * @param text text
   */
  onNameChanged(text: string) {
    this.task.name = text;
    this.notify();
  }

  //
  // Notifications
  //

  private notify() {
    this.taskEventEmitter.emit({task: this.task});
  }
}
