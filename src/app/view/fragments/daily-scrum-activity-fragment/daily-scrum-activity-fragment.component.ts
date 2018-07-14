import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DailyScrumActivity} from '../../../model/daily-scrum-activity';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Person} from '../../../model/person.model';
import {DAILY_SCRUM_ACTIVITY_TYPE} from '../../../model/daily-scrum-activity-type.enum';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-daily-scrum-activity-fragment',
  templateUrl: './daily-scrum-activity-fragment.component.html',
  styleUrls: ['./daily-scrum-activity-fragment.component.scss']
})
export class DailyScrumActivityFragmenComponent implements OnInit {
  @Input() person: Person;
  @Input() dailyScrumActivity: DailyScrumActivity;
  @Output() activityEditedEmitter = new EventEmitter<string>();

  debouncer = new Subject();

  dailyScrumActivityOptions = [];
  filteredDailyScrumActivityOptions: Observable<string[]>;

  activityTypes = Object.keys(DAILY_SCRUM_ACTIVITY_TYPE).map(key => DAILY_SCRUM_ACTIVITY_TYPE[key]);

  formControl: FormControl = new FormControl();

  constructor(private taskletService: TaskletService) {
  }

  ngOnInit() {
    this.dailyScrumActivityOptions = Array.from(this.taskletService.getDailyScrumActivities(this.person).values()).reverse();
    this.filteredDailyScrumActivityOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterDailyScrumActivities(value))
      );

    this.debouncer.pipe(
      debounceTime(500)
    ).subscribe((value: string) => this.activityEditedEmitter.emit(value));
  }

  filterDailyScrumActivities(val: string): string[] {
    return this.dailyScrumActivityOptions.filter(option =>
      option.toLowerCase().includes(val.toLowerCase()));
  }

  onTopicEdited() {
    this.debouncer.next('');
  }
}
