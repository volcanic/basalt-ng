import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProjectDigest} from '../../../../../../core/digest/model/project-digest.model';
import {DateService} from '../../../../../../core/entity/services/date.service';
import {Tasklet} from '../../../../../../core/entity/model/tasklet.model';
import {Task} from '../../../../../../core/entity/model/task.model';
import {Project} from '../../../../../../core/entity/model/project.model';
import {DigestService} from '../../../../../../core/digest/services/digest/digest.service';
import {Hash} from '../../../../../../core/entity/model/hash';
import {TaskletService} from '../../../../../../core/entity/services/tasklet/tasklet.service';

/**
 * Displays digest fragment
 */
@Component({
  selector: 'app-digest-fragment',
  templateUrl: './digest-fragment.component.html',
  styleUrls: ['./digest-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DigestFragmentComponent implements OnInit, OnChanges {

  /** Map of tasklets */
  @Input() taskletsMap = new Map<string, Tasklet>();
  /** Map of tasks */
  @Input() tasksMap = new Map<string, Task>();
  /** Map of projects */
  @Input() projectsMap = new Map<string, Project>();

  /** Indicator date */
  indicatedDate = new Date();

  /** Weekly digest */
  public weeklyDigest: ProjectDigest;
  /** Daily digests */
  public dailyDigests: ProjectDigest[];

  /** Hash of tasklets */
  private taskletsHash = 0;
  /** Hash of tasks */
  private tasksHash = 0;
  /** Hash of projects */
  private projectsHash = 0;

  /** Earliest date of all tasklets */
  earliestDate = new Date();
  /** Latest date of all tasklets */
  latestDate = new Date();

  /** Reference to static service methods */
  isInWeek = DateService.isInWeek;

  /**
   * Constructor
   * @param digestService digest service
   */
  constructor(private digestService: DigestService) {
  }

  //
  // Lifecycle hooks
  //

  ngOnInit() {
    this.setHashesAndGeneratreReport();
  }

  /**
   * Handles on-init lifecycle phase
   */
  ngOnChanges(changes: SimpleChanges) {
    this.setHashesAndGeneratreReport();
  }

  private setHashesAndGeneratreReport() {
    const newTaskletsHash = Hash.hash(JSON.stringify(Array.from(this.taskletsMap.values())));
    const newTasksHash = Hash.hash(JSON.stringify(Array.from(this.tasksMap.values())));
    const newProjectsHash = Hash.hash(JSON.stringify(Array.from(this.projectsMap.values())));

    if (this.taskletsHash !== newTaskletsHash ||
      this.tasksHash !== newTasksHash ||
      this.projectsHash !== newProjectsHash) {
      this.determineBoundaries();
      this.generateReport();
    }

    this.taskletsHash = newTaskletsHash;
    this.tasksHash = newTasksHash;
    this.projectsHash = newProjectsHash;
  }

//
  // Actions
  //

  /**
   * Handles click on previous-week button
   */
  onPreviousWeekClicked() {
    this.indicatedDate = DateService.addDays(this.indicatedDate, -7);
    this.generateReport();
  }

  /**
   * Handles click on next-week button
   */
  onNextWeekClicked() {
    this.indicatedDate = DateService.addDays(this.indicatedDate, 7);
    this.generateReport();
  }

  //
  //
  //

  /**
   * Determines date boundaries
   */
  private determineBoundaries() {
    if (this.taskletsMap != null && this.taskletsMap.size > 0) {
      const tasklets = Array.from(this.taskletsMap.values()).sort(TaskletService.sortTaskletsByCreationDate);
      this.earliestDate = new Date(tasklets.reverse()[0].creationDate);
      this.latestDate = new Date(Array.from(this.taskletsMap.values()).sort(TaskletService.sortTaskletsByCreationDate)[0].creationDate);
    }
  }

  /**
   * Generates a report for the indicated date
   */
  private generateReport() {
    this.generateWeeklyDigest(this.indicatedDate);
    this.generateDailyDigests(this.indicatedDate);
  }

  /**
   * Generates weekly digest
   * @param date focus date
   */
  private generateWeeklyDigest(date: Date) {
    this.weeklyDigest = this.digestService.getWeeklyDigest(date,
      this.taskletsMap,
      this.tasksMap,
      this.projectsMap);
  }

  /**
   * Generates daily digests
   * @param date focus date
   */
  private generateDailyDigests(date: Date) {
    this.dailyDigests = [];
    const weekStart = DateService.getWeekStart(date);
    const day = new Date(weekStart);

    // Iterate over all weekdays
    [0, 1, 2, 3, 4, 5, 6].forEach(index => {
      const focusDate = new Date(day.setDate(weekStart.getDate() + index));
      const dailyDigest = this.digestService.getDailyDigest(focusDate,
        this.taskletsMap,
        this.tasksMap,
        this.projectsMap);

      if (dailyDigest.getProjectEffortSum() > 0) {
        this.dailyDigests.push(dailyDigest);
      }
    });
  }
}
