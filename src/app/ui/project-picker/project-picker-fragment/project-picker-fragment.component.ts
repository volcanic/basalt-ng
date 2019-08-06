import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatMenuTrigger} from '@angular/material';

/**
 * Displays project picker
 */
@Component({
  selector: 'app-project-picker-fragment',
  templateUrl: './project-picker-fragment.component.html',
  styleUrls: ['./project-picker-fragment.component.scss']
})
export class ProjectPickerFragmentComponent {

  /** Project name to be displayed */
  @Input() projectName: string;
  /** Project color to be used */
  @Input() projectColor: string;
  /** Project option names */
  @Input() projectOptionNames = [];
  /** Whether component is readonly or not */
  @Input() readonly = false;

  /** Event emitter indicating changes in project name */
  @Output() projectNameChangedEmitter = new EventEmitter<string>();

  /** Context menu trigger */
  @ViewChild(MatMenuTrigger, {static: false}) contextMenuTrigger: MatMenuTrigger;

  //
  // Actions
  //

  /**
   * Handles click on project
   */
  onProjectClicked() {
    if (!this.readonly) {
      this.contextMenuTrigger.openMenu();
    }
  }

  /**
   * Handles project selection
   */
  onProjectSelected(projectName) {
    this.projectNameChangedEmitter.emit(projectName);
  }
}
