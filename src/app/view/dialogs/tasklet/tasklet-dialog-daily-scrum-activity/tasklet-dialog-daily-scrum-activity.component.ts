import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DailyScrumActivity} from '../../../../model/daily-scrum-activity';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Person} from '../../../../model/person.model';
import {TaskletsService} from '../../../../services/tasklets.service';
import {DAILY_SCRUM_ACTIVITY_TYPE} from '../../../../model/daily-scrum-activity-type.enum';

@Component({
  selector: 'app-tasklet-dialog-daily-scrum-activity',
  templateUrl: './tasklet-dialog-daily-scrum-activity.component.html',
  styleUrls: ['./tasklet-dialog-daily-scrum-activity.component.scss']
})
export class TaskletDialogDailyScrumActivityComponent implements OnInit {
  @Input() person: Person;
  @Input() dailyScrumActivity: DailyScrumActivity;
  @Output() onActivityEmitter = new EventEmitter<string>();

  dailyScrumActivityOptions = [];
  filteredDailyScrumActivityOptions: Observable<string[]>;

  activityTypes = Object.keys(DAILY_SCRUM_ACTIVITY_TYPE).map(key => DAILY_SCRUM_ACTIVITY_TYPE[key]);

  formControl: FormControl = new FormControl();

  constructor(private taskletsService: TaskletsService) {
  }

  ngOnInit() {
    this.dailyScrumActivityOptions = Array.from(this.taskletsService.getDailyScrumActivities(this.person).values()).reverse();
    this.filteredDailyScrumActivityOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterDailyScrumActivities(value))
      );
  }

  filterDailyScrumActivities(val: string): string[] {
    return this.dailyScrumActivityOptions.filter(option =>
      option.toLowerCase().includes(val.toLowerCase()));
  }

  onTopicEdited() {
    this.onActivityEmitter.next('');
  }
}
