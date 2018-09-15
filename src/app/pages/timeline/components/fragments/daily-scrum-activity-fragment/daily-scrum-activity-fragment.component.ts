import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DailyScrumActivity} from 'app/core/entity/model/daily-scrum-activity';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Person} from 'app/core/entity/model/person.model';
import {DailyScrumActivityType} from 'app/core/entity/model/daily-scrum-activity-type.enum';
import {Subject} from 'rxjs/Subject';

/**
 * Displays daily scrum activity fragment
 */
@Component({
  selector: 'app-daily-scrum-activity-fragment',
  templateUrl: './daily-scrum-activity-fragment.component.html',
  styleUrls: ['./daily-scrum-activity-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyScrumActivityFragmentComponent implements OnInit {

  /** Person to be displayed */
  @Input() person: Person;
  /** Daily scrum activity to be displayed */
  @Input() dailyScrumActivity: DailyScrumActivity;
  /** Array of daily scrum activities */
  @Input() dailyScrumActivityOptions = [];

  /** Event emitter indicating changes in activity */
  @Output() activityEditedEmitter = new EventEmitter<string>();

  /** Debouncer for daily scrum activity */
  dailyScrumActivityDebouncer = new Subject();


  /** Array of filtered daily scrum activities */
  filteredDailyScrumActivityOptions: Observable<string[]>;

  /** Enum of daily scrum activity types */
  activityTypes = Object.keys(DailyScrumActivityType).map(key => DailyScrumActivityType[key]);

  /** Form control */
  formControl: FormControl = new FormControl();

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
   * Initializes daily scrum activity taskOptions
   */
  private initializeDailyScrumActivityOptions() {
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
   * @returns {string[]} array of filtered taskOptions
   */
  filterDailyScrumActivities(value: string): string[] {
    return this.dailyScrumActivityOptions.filter(option =>
      option.toLowerCase().includes(value.toLowerCase()));
  }
}
