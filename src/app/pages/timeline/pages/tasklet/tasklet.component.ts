import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TaskletService} from '../../../../core/entity/services/tasklet.service';
import {Tasklet} from '../../../../core/entity/model/tasklet.model';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-tasklet',
  templateUrl: './tasklet.component.html',
  styleUrls: ['./tasklet.component.scss']
})
export class TaskletComponent implements OnInit, OnDestroy {

  /** ID passed as an argument */
  id: string;
  /** Tasklet to be displayed */
  tasklet: Tasklet;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param taskletService tasklet service
   * @param route route
   */
  constructor(private taskletService: TaskletService,
              private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.taskletService.findTaskletByID(this.id);
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeResolvedData();
    this.initializeTaskletSubscription();
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
   * Initializes resolved data
   */
  private initializeResolvedData() {
    this.tasklet = this.route.snapshot.data['tasklet'];
  }

  /**
   * Initializes tasklet subscription
   */
  private initializeTaskletSubscription() {
    this.taskletService.taskletSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.tasklet = value as Tasklet;
      }
    });
  }

}
