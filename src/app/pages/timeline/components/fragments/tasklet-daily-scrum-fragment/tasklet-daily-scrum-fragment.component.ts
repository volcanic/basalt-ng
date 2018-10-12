import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Tasklet} from '../../../../../core/entity/model/tasklet.model';
import {DailyScrumItem} from '../../../../../core/entity/model/daily-scrum/daily-scrum-item.model';

/**
 * Displays daily scrum fragment
 */
@Component({
  selector: 'app-tasklet-daily-scrum-fragment',
  templateUrl: './tasklet-daily-scrum-fragment.component.html',
  styleUrls: ['./tasklet-daily-scrum-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskletDailyScrumFragmentComponent implements OnInit {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;

  /** Persons */
  persons: string[] = [];

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializePersons();
  }

  /**
   * Initializes persons
   */
  private initializePersons() {
    const personsMap = new Map<string, string>();

    if (this.tasklet != null && this.tasklet.dailyScrumItems != null) {
      this.tasklet.dailyScrumItems.forEach(d => {
        if (d.person != null) {
          const person = d.person.name;
          personsMap.set(person, person);
        }
      });

      this.persons = Array.from(personsMap.values());
    }
  }

  /**
   * Returns list of daily scrum items by person
   * @param person person
   */
  public getDailyScrumItemsByPerson(person: string): DailyScrumItem[] {
    return this.tasklet.dailyScrumItems.filter(d => {
      return (d.person != null && d.person.name === person);
    }).sort((d1, d2) => {
      return new Date(d2.date).getTime() < new Date(d1.date).getTime() ? 1 : -1;
    }).sort((a, b) => {
      if (a.type < b.type) {
        return 1;
      }
      if (a.type > b.type) {
        return -1;
      }
      return 0;
    });
  }
}
