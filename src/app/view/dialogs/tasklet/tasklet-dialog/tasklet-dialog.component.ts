import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {UUID} from '../../../../model/util/uuid';
import {Tasklet} from '../../../../model/entities/tasklet.model';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {TASKLET_TYPE} from '../../../../model/tasklet-type.enum';
import {Tag} from '../../../../model/tag.model';
import {TaskletDailyScrum} from '../../../../model/tasklet-daily-scrum.model';
import {Person} from '../../../../model/person.model';
import {ConfirmationDialogComponent} from '../../other/confirmation-dialog/confirmation-dialog.component';
import {SnackbarService} from '../../../../services/snackbar.service';
import {TaskletWeeklyDigest} from '../../../../model/tasklet-weekly-digest.model';
import {TaskletService} from '../../../../services/entities/tasklet.service';
import {TaskService} from '../../../../services/entities/task.service';

@Component({
  selector: 'app-tasklet-dialog',
  templateUrl: './tasklet-dialog.component.html',
  styles: [require('./tasklet-dialog.component.scss')],
})
export class TaskletDialogComponent implements OnInit {
  DIALOG_MODE: typeof DIALOG_MODE = DIALOG_MODE;

  mode = DIALOG_MODE.NONE;
  dialogTitle = '';
  tasklet: Tasklet;
  previousText = '';

  taskOptions = [];
  personOptions = [];

  constructor(private taskService: TaskService,
              private taskletService: TaskletService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<TaskletDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.tasklet = JSON.parse(JSON.stringify(this.data.tasklet));
    this.previousText = this.data.previousText;

    this.taskOptions = Array.from(this.taskService.tasks.values());
    this.personOptions = Array.from(this.taskletService.getPersons().values());
  }

  //
  // Listeners
  //

  onTagChangedEmitter (tags: Tag[]) {
    this.tasklet.tags = tags;
  }

  onPersonChangedEmitter(persons: Person[]) {
    this.tasklet.persons = persons;
  }

  //
  // Action buttons
  //

  addTasklet() {
    this.tasklet.tags = this.aggregateTags(this.tasklet);
    this.tasklet.persons = this.aggregatePersons(this.tasklet);

    switch (this.tasklet.type) {
      case TASKLET_TYPE.DAILY_SCRUM: {
        this.updateTaskletDailyScrum(this.tasklet as TaskletDailyScrum);
        break;
      }
      case TASKLET_TYPE.LUNCH_BREAK:
      case TASKLET_TYPE.FINISHING_TIME: {
        this.dialogRef.close(this.tasklet as Tasklet);
        break;
      }
      case TASKLET_TYPE.WEEKLY_DIGEST: {
        this.dialogRef.close(this.tasklet as TaskletWeeklyDigest);
        break;
      }
      default: {
        this.dialogRef.close(this.tasklet);
      }
    }
  }

  updateTasklet() {
    this.tasklet.tags = this.aggregateTags(this.tasklet);
    this.tasklet.persons = this.aggregatePersons(this.tasklet);

    switch (this.tasklet.type) {
      case TASKLET_TYPE.DAILY_SCRUM: {
        this.updateTaskletDailyScrum(this.tasklet as TaskletDailyScrum);
        break;
      }
      case TASKLET_TYPE.LUNCH_BREAK:
      case TASKLET_TYPE.FINISHING_TIME: {
        this.dialogRef.close(this.tasklet as Tasklet);
        break;
      }
      default: {
        this.dialogRef.close(this.tasklet as Tasklet);
        break;
      }
    }
  }

  updateTaskletDailyScrum(tasklet: TaskletDailyScrum) {
    tasklet.participants = tasklet.participants.filter(p => {
      return p.person != null && p.person.name.length > 0;
    });
    tasklet.participants.forEach(p => {
      p.activities = p.activities.filter(a => {
        return a.topic.length > 0;
      });
    });
    this.dialogRef.close(this.tasklet);
  }

  deleteTasklet() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
      disableClose: true,
      data: {
        title: 'Delete tasklet',
        text: 'Do you want to delete this tasklet?',
        action: 'Delete',
        value: this.tasklet
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletService.deleteTasklet(result as Tasklet);
        this.snackbarService.showSnackbar('Deleted tasklet', '');
        this.dialogRef.close(null);
      }
    });
  }

  continueTasklet() {
    this.tasklet.id = new UUID().toString();
    this.tasklet.creationDate = new Date();

    this.dialogRef.close(this.tasklet);
  }

  //
  // Helpers
  //

  aggregateTags(tasklet: Tasklet): Tag[] {
    console.log(`DEBUG tags ${tasklet.tags}`);

    const aggregatedTags = new Map<string, Tag>();

    // Concatenate
    this.tasklet.tags.forEach(tag => {
      aggregatedTags.set(tag.name, tag);
    });
    this.inferTags(tasklet).forEach((value, key) => {
      aggregatedTags.set(key, value);
    });

    return Array.from(aggregatedTags.values());
  }

  inferTags(tasklet: Tasklet): Map<string, Tag> {
    const inferredTags = new Map<string, Tag>();

    tasklet.description.value.split('\n').forEach(line => {
      line.split(' ').forEach(word => {
        if (word.startsWith('#')) {
          const tag = new Tag(word.replace('#', ''), true);
          inferredTags.set(tag.name, tag);
        }
      });
    });

    return inferredTags;
  }

  aggregatePersons(tasklet: Tasklet): Person[] {
    const aggregatedPersons = new Map<string, Person>();

    // Concatenate
    tasklet.persons.forEach(p => {
      aggregatedPersons.set(p.name, p);
    });
    this.inferPersons(tasklet).forEach((value, key) => {
      aggregatedPersons.set(key, value);
    });

    return Array.from(aggregatedPersons.values());
  }

  inferPersons(tasklet: Tasklet): Map<string, Person> {
    const inferredPersons = new Map<string, Person>();

    tasklet.description.value.split('\n').forEach(line => {
      line.split(' ').forEach(word => {
        if (word.startsWith('@')) {
          const person = new Person(word.replace('@', '').replace('_', ' '));
          inferredPersons.set(person.name, person);
        }
      });
    });

    return inferredPersons;
  }
}
