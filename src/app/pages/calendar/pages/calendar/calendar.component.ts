import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {Tasklet} from '../../../../core/entity/model/tasklet.model';
import {TaskletService} from '../../../../core/entity/services/tasklet/tasklet.service';
import {FilterService} from '../../../../core/entity/services/filter.service';
import {MatchService} from '../../../../core/entity/services/match.service';
import {Subject} from 'rxjs';

/**
 * Displays calendar page
 */
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  /** Array of tasklets */
  public tasklets: Tasklet[] = [];
  /** Focus day to be displayed */
  focusDay = new Date();

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param taskletService tasklet service
   * @param matchService match service
   * @param filterService filter service
   */
  constructor(private taskletService: TaskletService,
              private matchService: MatchService,
              private filterService: FilterService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeTaskletSubscription();
  }

  /**
   * Handles on-destroy lifecycle phase
   */
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Initialization
  //

  /**
   * Initializes tasklet subscription
   */
  private initializeTaskletSubscription() {
    this.taskletService.taskletsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        /*
        this.tasklets = Array.from((value as Tasklet[])).filter(tasklet => {
          const matchesSearchItem = this.matchService.taskletMatchesEveryItem(tasklet, this.filterService.searchItem);
          const matchesProjects = this.matchService.taskletMatchesProjects(tasklet,
            Array.from(this.filterService.projects.values()));

          return matchesSearchItem && matchesProjects;
        });
        */
      }
    });
  }
}
