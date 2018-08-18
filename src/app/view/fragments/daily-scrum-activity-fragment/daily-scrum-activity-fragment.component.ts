import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DailyScrumActivity} from '../../../model/entities/scrum/daily-scrum-activity';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Person} from '../../../model/entities/person.model';
import {DailyScrumActivityType} from '../../../model/entities/scrum/daily-scrum-activity-type.enum';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {Subject} from 'rxjs/Subject';

/**
 * Displays daily scrum activity fragment
 */
@Component({
  selector: 'app-daily-scrum-activity-fragment',
  templateUrl: './daily-scrum-activity-fragment.component.html',
  styleUrls: ['./daily-scrum-activity-fragment.component.scss']
})
export class DailyScrumActivityFragmentComponent implements OnInit {

  /** Person to be displayed */
  @Input() person: Person;
  /** Daily scrum activity to be displayed */
  @Input() dailyScrumActivity: DailyScrumActivity;

  /** Event emitter indicating changes in activity */
  @Output() activityEditedEmitter = new EventEmitter<string>();

  /** Debouncer for daily scrum activity */
  dailyScrumActivityDebouncer = new Subject();

  /** Array of daily scrum activities */
  dailyScrumActivityOptions = [];
  /** Array of filtered daily scrum activities */
  filteredDailyScrumActivityOptions: Observable<string[]>;

  /** Enum of daily scrum activity types */
  activityTypes = Object.keys(DailyScrumActivityType).map(key => DailyScrumActivityType[key]);

  /** Form control */
  formControl: FormControl = new FormControl();

  /**
   * Constructor
   * @param {TaskletService} taskletService
   */
  constructor(private taskletService: TaskletService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeDailyScrumActivityOptions();
  }

  //
  // Initialization
  //

  /**
   * Initializes daily scrum activity options
   */
  private initializeDailyScrumActivityOptions() {
    this.dailyScrumActivityOptions = Array.from(this.taskletService.getDailyScrumActivities(this.person).values()).reverse();
    this.filteredDailyScrumActivityOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterDailyScrumActivities(value))
      );
    this.dailyScrumActivityDebouncer.pipe(
      debounceTime(500)
    ).subscribe((value: string) => this.activityEditedEmitter.emit(value));
  }

  //
  // Actions
  //

  /**
   * Handles topic changes
   */
  onTopicUpdated() {
    this.dailyScrumActivityDebouncer.next('');
  }

  //
  // Helpers
  //

  /**
   * Filters daily scum activities
   * @param {string} value currently typed value
   * @returns {string[]} array of filtered options
   */
  filterDailyScrumActivities(value: string): string[] {
    return this.dailyScrumActivityOptions.filter(option =>
      option.toLowerCase().includes(value.toLowerCase()));
  }

}
