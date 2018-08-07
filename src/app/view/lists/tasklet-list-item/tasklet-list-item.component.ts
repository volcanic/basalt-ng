import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatMenuTrigger} from '@angular/material';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {Tasklet} from '../../../model/entities/tasklet.model';
import {TaskletDialogComponent} from '../../dialogs/entities/tasklet-dialog/tasklet-dialog.component';
import {ConfirmationDialogComponent} from '../../dialogs/other/confirmation-dialog/confirmation-dialog.component';
import {DateService} from '../../../services/date.service';
import {DIALOG_MODE} from '../../../model/dialog-mode.enum';
import {Tag} from '../../../model/tag.model';
import {TimePickerDialogComponent} from '../../dialogs/other/time-picker-dialog/time-picker-dialog.component';
import {UUID} from '../../../model/util/uuid';
import {TASKLET_TYPE} from '../../../model/tasklet-type.enum';
import {TaskletDailyScrum} from '../../../model/tasklet-daily-scrum.model';
import {Project} from '../../../model/entities/project.model';
import {ProjectService} from '../../../services/entities/project.service';
import {ColorService} from '../../../services/color.service';
import {Description} from '../../../model/description.model';
import {CloneService} from '../../../services/util/clone.service';
import {FilterService} from '../../../services/filter.service';
import {MediaService} from '../../../services/media.service';
import {takeUntil} from 'rxjs/internal/operators';
import {MEDIA} from '../../../model/media.enum';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-tasklet-list-item',
  templateUrl: './tasklet-list-item.component.html',
  styleUrls: ['./tasklet-list-item.component.scss']
})
export class TaskletListItemComponent implements OnInit, OnDestroy {

  @Input() tasklet: Tasklet;
  @ViewChild(MatMenuTrigger) contextMenuTrigger: MatMenuTrigger;

  media: MEDIA = MEDIA.UNDEFINED;
  mediaType = MEDIA;

  tags: Tag[] = [];
  projects: Project[] = [];

  icon = '';
  topic = '';
  project: Project;
  projectColor = 'transparent';
  time = '';
  weekDay = '';
  date = '';

  expansionPanelOpened = false;

  private unsubscribeSubject = new Subject();

  constructor(private projectService: ProjectService,
              private taskletService: TaskletService,
              private colorService: ColorService,
              private cloneService: CloneService,
              private filterService: FilterService,
              private mediaService: MediaService,
              public dateService: DateService,
              public dialog: MatDialog,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.initializeMediaSubscription();
    this.initializeProjects();
    this.initializeDate();
    this.initializeIcon();
    this.initializeTopic();
    this.initializeProject();
    this.initializeExpansionPanel();
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Initialization
  //

  private initializeMediaSubscription() {
    this.media = this.mediaService.media;
    this.mediaService.mediaSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.media = value;
    });
  }

  private initializeProjects() {
    this.projects = Array.from(this.projectService.projects.values());
  }

  private initializeIcon() {
    switch (this.tasklet.type) {
      case TASKLET_TYPE.ACTION: {
        this.icon = 'turned_in_not';
        break;
      }
      case TASKLET_TYPE.MEETING: {
        this.icon = 'people';
        break;
      }
      case TASKLET_TYPE.CALL: {
        this.icon = 'call';
        break;
      }
      case TASKLET_TYPE.DAILY_SCRUM: {
        this.icon = 'scrum';
        break;
      }
      case TASKLET_TYPE.MAIL: {
        this.icon = 'mail';
        break;
      }
      case TASKLET_TYPE.CHAT: {
        this.icon = 'chat';
        break;
      }
      case TASKLET_TYPE.DEVELOPMENT: {
        this.icon = 'code';
        break;
      }
      case TASKLET_TYPE.DEBUGGING: {
        this.icon = 'bug_report';
        break;
      }
      case TASKLET_TYPE.IDEA: {
        this.icon = 'lightbulb_outline';
        break;
      }
      case TASKLET_TYPE.LUNCH_BREAK: {
        this.icon = 'local_dining';
        break;
      }
      case TASKLET_TYPE.FINISHING_TIME: {
        this.icon = 'directions_run';
        break;
      }
      case TASKLET_TYPE.WEEKLY_DIGEST: {
        this.icon = 'receipt';
        break;
      }
    }
  }

  private initializeDate() {
    this.time = this.dateService.getTime(new Date(this.tasklet.creationDate));
    this.weekDay = this.dateService.getWeekDayString(new Date(this.tasklet.creationDate).getDay());
    this.date = this.dateService.getDate(new Date(this.tasklet.creationDate));
  }

  private initializeTopic() {
    switch (this.tasklet.type) {
      case TASKLET_TYPE.DAILY_SCRUM:
      case TASKLET_TYPE.LUNCH_BREAK:
      case TASKLET_TYPE.FINISHING_TIME:
      case TASKLET_TYPE.WEEKLY_DIGEST: {
        this.topic = this.tasklet.type;
        break;
      }
      default: {
        const task = this.taskletService.getTaskByTasklet(this.tasklet);

        if (task != null) {
          this.topic = task.name;
        } else {
          this.topic = this.tasklet.type;
        }
      }
    }
  }

  private initializeProject() {
    this.project = this.taskletService.getProjectByTasklet(this.tasklet);
    this.projectColor = this.colorService.getProjectColor(this.project);
  }

  private initializeExpansionPanel() {
    this.expansionPanelOpened = !this.dateService.isBeforeToday(this.tasklet.creationDate);
  }

  //
  // Actions
  //

  onActionFired(action: string) {
    switch (action) {
      case 'card': {
        if (this.media > this.mediaType.MEDIUM) {
          this.onActionFired('update-tasklet');
        } else {
          this.contextMenuTrigger.openMenu();
        }
        break;
      }
      case 'update-tasklet': {
        this.updateTasklet();
        break;
      }
      case 'update-time': {
        this.updateTaskletTime();
        break;
      }
      case 'continue-tasklet': {
        this.continueTasklet();
        break;
      }
      case 'template': {
        this.templateTasklet();
        break;
      }
      case 'save': {
        this.taskletService.updateTasklet(this.tasklet).then(() => {
          this.changeDetector.markForCheck();
        });
        break;
      }
    }
  }

  onToggleExpansionPanel() {
    this.expansionPanelOpened = !this.expansionPanelOpened;
  }

  private updateTasklet() {
    const dialogRef = this.dialog.open(TaskletDialogComponent, <MatDialogConfig>{
      disableClose: false,
      data: {
        mode: DIALOG_MODE.UPDATE,
        dialogTitle: 'Update tasklet',
        tasklet: this.tasklet,
        projects: this.projects
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const tasklet = result as Tasklet;
        this.taskletService.updateTasklet(tasklet).then(() => {
          this.changeDetector.markForCheck();
        });
        this.filterService.updateTagsList(tasklet.tags, true);
      }
    });
  }

  private continueTasklet() {
    // Deep copy
    const continueTasklet = this.cloneService.cloneTasklet(this.tasklet);

    continueTasklet['_rev'] = null;
    continueTasklet.id = new UUID().toString();
    continueTasklet.description = new Description();
    continueTasklet.creationDate = new Date();
    continueTasklet.persons = []; // TODO: Depending on tasklet type, this might be worth keeping

    if (this.tasklet.type === TASKLET_TYPE.IDEA) {
      continueTasklet.type = TASKLET_TYPE.ACTION;
    }

    const dialogRef = this.dialog.open(TaskletDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.CONTINUE,
        dialogTitle: 'Continue tasklet',
        tasklet: continueTasklet,
        projects: this.projects,
        previousDescription: this.tasklet.description
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const tasklet = result as Tasklet;
        this.taskletService.createTasklet(result);
        this.filterService.updateTagsList(tasklet.tags, true);
      }
    });
  }

  private templateTasklet() {
    // Deep copy
    const template = this.cloneService.cloneTasklet(this.tasklet);

    template['_rev'] = null;
    template.id = new UUID().toString();
    template.description = new Description();
    template.creationDate = new Date();
    template.participants.forEach(p => {
        p.activities = [];
      }
    );

    const dialogRef = this.dialog.open(TaskletDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.CONTINUE,
        dialogTitle: 'Continue tasklet',
        tasklet: template,
        projects: this.projects
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const tasklet = result as TaskletDailyScrum;
        this.taskletService.createTasklet(tasklet);
        this.filterService.updateTagsList(tasklet.tags, true);
      }
    });
  }

  private updateTaskletTime() {
    const dialogRef = this.dialog.open(TimePickerDialogComponent, <MatDialogConfig>{
      disableClose: false,
      data: {
        dialogTitle: 'Set creation time',
        tasklet: this.tasklet
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const tasklet = result as Tasklet;
        this.taskletService.updateTasklet(tasklet).then(() => {
          this.changeDetector.markForCheck();
        });
      }
    });
  }

  public deleteTasklet() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
      disableClose: false,
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
        this.filterService.updateTagsList([], false);
      }
    });
  }
}
