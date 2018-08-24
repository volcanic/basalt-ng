import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatMenuTrigger} from '@angular/material';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {Tasklet} from '../../../model/entities/tasklet.model';
import {TaskletDialogComponent} from '../../dialogs/entities/tasklet-dialog/tasklet-dialog.component';
import {ConfirmationDialogComponent} from '../../dialogs/other/confirmation-dialog/confirmation-dialog.component';
import {DateService} from '../../../services/util/date.service';
import {DialogMode} from '../../../model/ui/dialog-mode.enum';
import {Tag} from '../../../model/entities/tag.model';
import {TimePickerDialogComponent} from '../../dialogs/other/time-picker-dialog/time-picker-dialog.component';
import {UUID} from '../../../model/util/uuid';
import {TaskletType} from '../../../model/tasklet-type.enum';
import {TaskletDailyScrum} from '../../../model/entities/scrum/tasklet-daily-scrum.model';
import {Project} from '../../../model/entities/project.model';
import {ProjectService} from '../../../services/entities/project.service';
import {ColorService} from '../../../services/ui/color.service';
import {Description} from '../../../model/entities/fragments/description.model';
import {CloneService} from '../../../services/util/clone.service';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {MediaService} from '../../../services/ui/media.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Media} from '../../../model/ui/media.enum';
import {Subject} from 'rxjs/Subject';
import {TagService} from '../../../services/entities/tag.service';
import {PersonService} from '../../../services/entities/person.service';

/**
 * Displays tasklet list item
 */
@Component({
  selector: 'app-tasklet-list-item',
  templateUrl: './tasklet-list-item.component.html',
  styleUrls: ['./tasklet-list-item.component.scss']
})
export class TaskletListItemComponent implements OnInit, OnDestroy {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;

  /** Trigger for context menu */
  @ViewChild(MatMenuTrigger) contextMenuTrigger: MatMenuTrigger;

  /** Default theme to be used */
  themeClass = 'light-theme';

  /** Enum for media types */
  mediaType = Media;
  /** Current media */
  media: Media = Media.UNDEFINED;

  /** Array of tags */
  tags: Tag[] = [];
  /** Array of projects */
  projects: Project[] = [];
  /** Icon name */
  icon = '';
  /** Topic (typically derived from task name */
  topic = '';
  /** Project */
  project: Project;
  /** Project color */
  projectColor = 'transparent';
  /** Creation time */
  time = '';
  /** Creation weekday */
  weekDay = '';
  /** Creation date */
  date = '';

  /** Expansion panel state */
  expansionPanelOpened = false;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** Reference to static service methods */
  isBeforeToday = DateService.isBeforeToday;

  /**
   * Constructor
   * @param {ProjectService} projectService
   * @param {TaskletService} taskletService
   * @param {ColorService} colorService
   * @param {CloneService} cloneService
   * @param {FilterService} filterService
   * @param {MediaService} mediaService
   * @param {ChangeDetectorRef} changeDetector
   * @param {TagService} tagService tag service
   * @param {PersonService} personService person service
   * @param {DateService} dateService date service
   * @param {MatDialog} dialog dialog
   */
  constructor(private projectService: ProjectService,
              private taskletService: TaskletService,
              private colorService: ColorService,
              private cloneService: CloneService,
              private filterService: FilterService,
              private mediaService: MediaService,
              private changeDetector: ChangeDetectorRef,
              public tagService: TagService,
              public personService: PersonService,
              public dateService: DateService,
              public dialog: MatDialog) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeMediaSubscription();
    this.initializeProjects();
    this.initializeDate();
    this.initializeIcon();
    this.initializeTopic();
    this.initializeProject();
    this.initializeExpansionPanel();
  }

  /**
   * Handles on-destroy lifecycle hook
   */
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Initialization
  //

  /**
   * Initializes media subscription
   */
  private initializeMediaSubscription() {
    this.media = this.mediaService.media;
    this.mediaService.mediaSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.media = value;
    });
  }

  /**
   * Initializes projects
   */
  private initializeProjects() {
    this.projects = Array.from(this.projectService.projects.values());
  }

  /**
   * Initializes icon
   */
  private initializeIcon() {
    switch (this.tasklet.type) {
      case TaskletType.ACTION: {
        this.icon = 'turned_in_not';
        break;
      }
      case TaskletType.MEETING: {
        this.icon = 'people';
        break;
      }
      case TaskletType.CALL: {
        this.icon = 'call';
        break;
      }
      case TaskletType.DAILY_SCRUM: {
        this.icon = 'scrum';
        break;
      }
      case TaskletType.MAIL: {
        this.icon = 'mail';
        break;
      }
      case TaskletType.CHAT: {
        this.icon = 'chat';
        break;
      }
      case TaskletType.DEVELOPMENT: {
        this.icon = 'code';
        break;
      }
      case TaskletType.DEBUGGING: {
        this.icon = 'bug_report';
        break;
      }
      case TaskletType.IDEA: {
        this.icon = 'lightbulb_outline';
        break;
      }
      case TaskletType.LUNCH_BREAK: {
        this.icon = 'local_dining';
        break;
      }
      case TaskletType.FINISHING_TIME: {
        this.icon = 'directions_run';
        break;
      }
      case TaskletType.WEEKLY_DIGEST: {
        this.icon = 'receipt';
        break;
      }
    }
  }

  /**
   * Initializes date
   */
  private initializeDate() {
    this.time = DateService.getTimeString(new Date(this.tasklet.creationDate));
    this.weekDay = DateService.getWeekDayString(new Date(this.tasklet.creationDate).getDay());
    this.date = DateService.getDateString(new Date(this.tasklet.creationDate));
  }

  /**
   * Initializes topic
   */
  private initializeTopic() {
    switch (this.tasklet.type) {
      case TaskletType.DAILY_SCRUM:
      case TaskletType.LUNCH_BREAK:
      case TaskletType.FINISHING_TIME:
      case TaskletType.WEEKLY_DIGEST: {
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

  /**
   * Initializes project
   */
  private initializeProject() {
    this.project = this.taskletService.getProjectByTasklet(this.tasklet);
    this.projectColor = this.colorService.getProjectColor(this.project);
  }

  /**
   * Initializes expansion panel
   */
  private initializeExpansionPanel() {
    this.expansionPanelOpened = !DateService.isBeforeToday(this.tasklet.creationDate);
  }

  //
  // Actions
  //

  /**
   * Handles actions
   * @param {string} action action
   */
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

  /**
   * Handles expansion panel toggle
   */
  onExpansionPanelToggled() {
    this.expansionPanelOpened = !this.expansionPanelOpened;
  }

  //
  // Actions
  //

  /**
   * Handles click on update button
   */
  private updateTasklet() {
    const dialogRef = this.dialog.open(TaskletDialogComponent, <MatDialogConfig>{
      disableClose: false,
      data: {
        mode: DialogMode.UPDATE,
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
        this.filterService.updateTagsList(tasklet.tagIds.map(id => {
          return this.tagService.getTagById(id);
        }).filter(tag => {
          return tag != null;
        }), true);
      }
    });
  }

  /**
   * Handles click on continue button
   */
  private continueTasklet() {
    const continueTasklet = CloneService.cloneTasklet(this.tasklet);

    continueTasklet['_rev'] = null;
    continueTasklet.id = new UUID().toString();
    continueTasklet.description = new Description();
    continueTasklet.creationDate = new Date();

    if (this.tasklet.type === TaskletType.IDEA) {
      continueTasklet.type = TaskletType.ACTION;
    }

    const dialogRef = this.dialog.open(TaskletDialogComponent, {
      disableClose: false,
      data: {
        mode: DialogMode.CONTINUE,
        dialogTitle: 'Continue tasklet',
        tasklet: continueTasklet,
        projects: this.projects,
        previousDescription: this.tasklet.description
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const tasklet = result as Tasklet;
        this.taskletService.createTasklet(result).then(() => {
          this.changeDetector.markForCheck();
        });
        this.filterService.updateTagsList(tasklet.tagIds.map(id => {
          return this.tagService.getTagById(id);
        }).filter(tag => {
          return tag != null;
        }), true);
      }
    });
  }

  /**
   * Handles click on template button
   */
  private templateTasklet() {
    const template = CloneService.cloneTasklet(this.tasklet);

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
        mode: DialogMode.CONTINUE,
        dialogTitle: 'Continue tasklet',
        tasklet: template,
        projects: this.projects
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const tasklet = result as TaskletDailyScrum;
        /*
        this.taskletService.createTasklet(tasklet).then(() => {
          this.changeDetector.markForCheck();
        });
        this.filterService.updateTagsList(tasklet.tagIds.map(id => {
          return this.tagService.getTagById(id);
        }).filter(tag => {
          return tag != null;
        }), true);
        */
      }
    });
  }

  /**
   * Handles click on creation time
   */
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
          this.changeDetector.detectChanges();
        });
      }
    });
  }

  /**
   * Handles click on delete button
   */
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
        this.taskletService.deleteTasklet(result as Tasklet).then(() => {
          this.changeDetector.markForCheck();
        });
        this.filterService.updateTagsList([], false);
      }
    });
  }
}
