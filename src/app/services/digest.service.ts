import {Injectable} from '@angular/core';
import {TaskletsService} from './tasklets.service';
import {Tasklet} from '../model/tasklet.model';
import {TASKLET_TYPE} from '../model/tasklet-type.enum';

@Injectable()
export class DigestService {

  constructor(private taskletsService: TaskletsService) {
  }

  /**
   * Returns the beginning of the week that contains a given date {@param date}
   * @returns {Date}
   */
  static getWeekStart(date: Date) {
    date = new Date(date);

    const day = date.getDay();
    const diff: number = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));

    monday.setHours(0, 0, 0, 0);

    return new Date(monday);
  }

  /**
   * Returns the end of the week that contains a given date {@param date}
   * @returns {Date}
   */
  static getWeekEnd(date: Date) {
    date = new Date(date);

    const day = date.getDay();
    const diff: number = date.getDate() - day + (day === 0 ? 0 : 7);
    const sunday = new Date(date.setDate(diff));

    sunday.setHours(23, 59, 59, 999);

    return new Date(sunday);
  }

  getRelevantTasklets(focusDate: Date): Tasklet[] {
    console.log(`DEBUG ${Array.from(this.taskletsService.tasklets.values()).length}`);

    return Array.from(this.taskletsService.tasklets.values()).filter(t => {
      return new Date(t.creationDate) > new Date(DigestService.getWeekStart(focusDate))
        && new Date(t.creationDate) < new Date(DigestService.getWeekEnd(focusDate))
        && t.type !== TASKLET_TYPE.LUNCH_BREAK
        && t.type !== TASKLET_TYPE.FINISHING_TIME
        && t.type !== TASKLET_TYPE.WEEKLY_DIGEST;
    });
  }
}
