import {Component, Inject, OnInit} from '@angular/core';
import {Task} from '../../../../model/entities/task.model';
import {Project} from '../../../../model/entities/project.model';
import {DateAdapter, MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {DateService} from '../../../../services/date.service';
import {ProjectService} from '../../../../services/entities/project.service';
import {ProjectDialogComponent} from '../project-dialog/project-dialog.component';
import {EntityService} from '../../../../services/entities/entity.service';
import {Tag} from '../../../../model/tag.model';
import {Tasklet} from '../../../../model/entities/tasklet.model';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {

  DIALOG_MODE: typeof DIALOG_MODE = DIALOG_MODE;

  mode = DIALOG_MODE.NONE;
  dialogTitle = '';
  task: Task;

  // Due date
  hour = 0;
  minute = 0;
  hours = [];
  minutes = [];

  // Priority
  colorEmpty = '#cfd8dc';
  colorsPriorities = [
    '#90a4ae',
    '#78909c',
    '#607d8b',
    '#546e7a',
    '#455a64',
  ];
  colorsFlags = [
    '#cfd8dc',
    '#cfd8dc',
    '#cfd8dc',
    '#cfd8dc',
    '#cfd8dc'
  ];

  // Project
  project: Project;
  projectOptions = [];

  // Tags
  tags: Tag[] = [];
  newTags: Tag[] = [];

  constructor(private entityService: EntityService,
              private projectService: ProjectService,
              private adapter: DateAdapter<any>,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<TaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.adapter.setLocale('en-GB');

    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.task = JSON.parse(this.data.task);

    this.initializeDueDate();
    this.initializePriority();
    this.initializeProject();
    this.initializeTags();
  }

  //
  // Initialization
  //

  initializeDueDate() {
    if (this.task.dueDate == null) {
      this.task.dueDate = new Date();
    }
    this.hour = new Date(this.task.dueDate).getHours();
    this.minute = new Date(this.task.dueDate).getMinutes();

    for (let h = 0; h < 24; h++) {
      this.hours.push(h);
    }
    for (let m = 0; m < 60; m = m + DateService.MINUTES_INTERVAL) {
      this.minutes.push(m);
    }

    this.hour = new Date(this.task.dueDate).getHours();
    this.minute = new Date(this.task.dueDate).getMinutes();
  }

  initializePriority() {
    this.colorsFlags.forEach((flagColor, index) => {
      if (index <= this.task.priority) {
        this.colorsFlags[index] = this.colorsPriorities[this.task.priority];
      } else {
        this.colorsFlags[index] = this.colorEmpty;
      }
    });
  }

  initializeProject() {
    this.project = this.entityService.getEntityById(this.task.projectId) as Project;
    this.projectOptions = Array.from(this.projectService.projects.values());
  }

  initializeTags() {
    this.tags = this.task.tags;
    this.newTags.push(new Tag('', false));
  }

  //
  // Listeners
  //

  onTagChangedEmitter (tags: Tag[]) {
    this.task.tags = tags;
  }

  //
  // Action buttons
  //

  addTask() {
    this.task.tags = this.aggregateTags(this.tags, this.newTags);
    this.dialogRef.close(this.task);
  }

  updateTask() {
    this.task.tags = this.aggregateTags(this.tags, this.newTags);
    this.dialogRef.close(this.task);
  }

  //
  // Due date
  //

  onHourSelected(value: number) {
    this.task.dueDate = new Date(this.task.dueDate.getFullYear(), this.task.dueDate.getMonth(), this.task.dueDate.getDate(), value, this.task.dueDate.getMinutes());
  }

  onMinuteSelected(value: number) {
    this.task.dueDate = new Date(this.task.dueDate.getFullYear(), this.task.dueDate.getMonth(), this.task.dueDate.getDate(), this.task.dueDate.getHours(), value);
  }

  addTrailingZero(value: number) {
    if (value < 10) {
      return `0${value}`;
    }

    return value;
  }

  //
  // Priority
  //

  onHoverFlag(priority: number) {
    this.colorsFlags.forEach((flagColor, index) => {
      if (index <= priority) {
        this.colorsFlags[index] = this.colorsPriorities[priority];
      } else {
        this.colorsFlags[index] = this.colorEmpty;
      }
    });
  }

  onLeaveFlag() {
    this.initializePriority();
  }

  onClickFlag(priority: number) {
    this.task.priority = priority;
  }

  //
  // Project
  //

  onProjectSelectionChanged() {
    this.task.projectId = this.project.id;
  }

  compareProject(p1: Project, p2: Project) {
    return p1 != null && p2 != null && p1.id === p2.id;
  }

  addProject() {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.ADD,
        dialogTitle: 'Add project',
        project: JSON.stringify(new Project('', true))
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.projectService.createProject(result as Project);
        this.projectOptions.push(result as Project);
      }
    });
  }

  //
  // Tags
  //

  aggregateTags(existingTags: Tag[], newTags: Tag[]): Tag[] {
    const aggregatedTags = new Map<string, Tag>();

    // Concatenate
    existingTags.filter(t => t.checked).forEach(t => {
      aggregatedTags.set(t.name, t);
    });
    newTags.filter(t => t.checked).forEach(t => {
      aggregatedTags.set(t.name, t);
    });

    return Array.from(aggregatedTags.values());
  }
}
