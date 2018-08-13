import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Tasklet} from '../../../model/entities/tasklet.model';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/operators';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {MatchService} from '../../../services/entities/filter/match.service';
import {TaskService} from '../../../services/entities/task.service';
import {ProjectService} from '../../../services/entities/project.service';
import {TagService} from '../../../services/entities/tag.service';
import {PersonService} from '../../../services/entities/person.service';

@Component({
  selector: 'app-tasklet-list',
  templateUrl: './tasklet-list.component.html',
  styleUrls: ['./tasklet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskletListComponent implements OnInit, OnDestroy {

  tasklets: Tasklet[] = [];
  taskletsAll: Tasklet[] = [];

  private unsubscribeSubject = new Subject();

  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private taskletService: TaskletService,
              private tagService: TagService,
              private personService: PersonService,
              private matchService: MatchService,
              private filterService: FilterService,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {

    this.initializeProjectSubscription();
    this.initializeTaskSubscription();
    this.initializeTaskletSubscription();
    this.initializeTagSubscription();
    this.initializePersonSubscription();
    this.initializeFilterSubscription();
  }

  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  public onIntersection(tasklet: Tasklet): void {
    this.taskletService.addElementToDateQueue(tasklet.creationDate);
  }

  //
  // Initialization
  //

  /**
   * Subscribes project changes
   */
  private initializeProjectSubscription() {

    this.projectService.projectsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.forceChangeDetection();
    });
  }

  /**
   * Subscribes task changes
   */
  private initializeTaskSubscription() {

    this.taskService.tasksSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.forceChangeDetection();
    });
  }

  /**
   * Subscribes tasklet changes
   */
  private initializeTaskletSubscription() {

    this.taskletService.taskletsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.taskletsAll = (value as Tasklet[]);
        this.update();
      }
    });
  }

  /**
   * Subscribes tag changes
   */
  private initializeTagSubscription() {

    this.tagService.tagsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.forceChangeDetection();
    });
  }

  /**
   * Subscribes person changes
   */
  private initializePersonSubscription() {

    this.personService.personsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.forceChangeDetection();
    });
  }

  /**
   * Subscribes filter changes
   */
  private initializeFilterSubscription() {

    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.update();
    });
  }

  /**
   * Enforces change detection
   */
  private forceChangeDetection() {
    this.tasklets = JSON.parse(JSON.stringify(this.tasklets));
    this.changeDetector.detectChanges();
  }

  /**
   * Filters original values
   */
  private update() {
    this.tasklets = this.taskletsAll.filter(tasklet => {

      const matchesSearchItem = this.matchService.taskletMatchesEveryItem(tasklet, this.filterService.searchItem);
      const matchesTags = this.matchService.taskletMatchesTags(tasklet,
        Array.from(this.filterService.tags.values()), this.filterService.tagsNone);
      const matchesProjects = this.matchService.taskletMatchesProjects(tasklet,
        Array.from(this.filterService.projects.values()), this.filterService.projectsNone);
      const matchesPersons = this.matchService.taskletMatchesPersons(tasklet,
        Array.from(this.filterService.persons.values()), this.filterService.personsNone);

      return matchesSearchItem && matchesTags && matchesProjects && matchesPersons;
    }).sort((t1: Tasklet, t2: Tasklet) => {

      return new Date(t2.creationDate).getTime() - new Date(t1.creationDate).getTime();
    });

    this.changeDetector.markForCheck();
  }
}
