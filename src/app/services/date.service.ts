import {Injectable} from '@angular/core';

@Injectable()
export class DateService {
  public static MINUTES_INTERVAL = 5;

  constructor() {
  }

  getTime(date: Date): string {
    if (date != null) {
      let hours = new Date(date).getHours();
      let minutes = this.getRoundedMinutes(new Date(date).getMinutes());

      if (minutes === 60) {
        minutes = 0;
        hours++;
      }
      if (hours === 24) {
        hours = 0;
      }

      let hoursString = hours.toString();
      let minutesString = minutes.toString();


      if (hours < 10) {
        hoursString = `0${hours}`;
      }


      if (minutes < 10) {
        minutesString = `0${minutes}`;
      }

      return `${hoursString}:${minutesString}`;
    } else {
      return '';
    }
  }

  getRoundedMinutes(minutes: number): number {
    return Math.ceil(minutes / DateService.MINUTES_INTERVAL) * DateService.MINUTES_INTERVAL;
  }

  getDate(date: Date): string {
    const weekday = this.getWeekDayString(new Date(date).getDay());
    const day = new Date(date).getDate();
    const month = this.getMonthString(new Date(date).getMonth());
    const year = new Date(date).getFullYear();
    return `${weekday}, ${day} ${month} ${year}`;
  }

  getWeekDayString(weekday: number) {
    switch (weekday) {
      case 0: {
        return 'Sunday';
      }
      case 1: {
        return 'Monday';
      }
      case 2: {
        return 'Tuesday';
      }
      case 3: {
        return 'Wednesday';
      }
      case 4: {
        return 'Thursday';
      }
      case 5: {
        return 'Friday';
      }
      case 6: {
        return 'Saturday';
      }
    }
  }

  getMonthString(month: number) {
    switch (month) {
      case 0: {
        return 'January';
      }
      case 1: {
        return 'February';
      }
      case 2: {
        return 'March';
      }
      case 3: {
        return 'April';
      }
      case 4: {
        return 'May';
      }
      case 5: {
        return 'June';
      }
      case 6: {
        return 'July';
      }
      case 7: {
        return 'August';
      }
      case 8: {
        return 'September';
      }
      case 9: {
        return 'October';
      }
      case 10: {
        return 'November';
      }
      case 11: {
        return 'December';
      }
    }
  }

  isBefore(d1: Date, d2: Date) {
    return new Date(d1).setHours(0, 0, 0, 0) < new Date(d2).setHours(0, 0, 0, 0);
  }

  isAfter(d1: Date, d2: Date) {
    return new Date(d1).setHours(0, 0, 0, 0) > new Date(d2).setHours(0, 0, 0, 0);
  }

  isToday(date: Date, now: Date) {
    return new Date(date).setHours(0, 0, 0, 0) === new Date(now).setHours(0, 0, 0, 0);
  }

  getBeginningOfTheWeek(date: Date): Date {
    const beginningOfTheWeek = new Date();

    const currentWeekDay = new Date(date).getDay();
    const daysFromMonday = currentWeekDay === 0 ? 6 : currentWeekDay - 1;

    beginningOfTheWeek.setHours(0, 0, 0, 0);
    beginningOfTheWeek.setDate(date.getDate() - daysFromMonday);

    return beginningOfTheWeek;
  }

  getEndOfTheWeek(date: Date): Date {
    const endOfTheWeek = new Date(date);

    const currentWeekDay = new Date(date).getDay();
    const daysTillSunday = currentWeekDay === 0 ? 0 : 7 - currentWeekDay;

    endOfTheWeek.setHours(23, 59, 59, 0);
    endOfTheWeek.setDate(date.getDate() + daysTillSunday);

    return endOfTheWeek;
  }

  isThisWeek(date: Date, now: Date) {
    const beginningOfTheWeek = this.getBeginningOfTheWeek(new Date(now));
    const endOfTheWeek = this.getEndOfTheWeek(new Date(now));

    return new Date(date) >= beginningOfTheWeek && new Date(date) <= endOfTheWeek;
  }

  isNextWeek(date: Date, now: Date) {
    const oneWeekLater = new Date(now).setDate(new Date(now).getDate() + 7);
    const beginningOfTheWeek = this.getBeginningOfTheWeek(new Date(oneWeekLater));
    const endOfTheWeek = this.getEndOfTheWeek(new Date(oneWeekLater));

    return new Date(date) >= beginningOfTheWeek && new Date(date) <= endOfTheWeek;
  }

  isAfterNextWeek(date: Date, now: Date) {
    const oneWeekLater = now.setDate(new Date(now).getDate() + 7);
    const endOfTheWeek = this.getEndOfTheWeek(new Date(oneWeekLater));

    return new Date(date) > endOfTheWeek;
  }

  getDayStart(date: Date): Date {
    date.setHours(0, 0, 0, 0);

    return new Date(date);
  }

  getDayEnd(date: Date): Date {
    date.setHours(23, 59, 59, 999);

    return new Date(date);
  }

  /**
   * Returns the beginning of the week that contains a given date {@param date}
   * @returns {Date}
   */
  getWeekStart(date: Date) {
    date = new Date(date);

    const day = date.getDay();
    const diff: number = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));

    return this.getDayStart(monday);
  }

  /**
   * Returns the end of the week that contains a given date {@param date}
   * @returns {Date}
   */
  getWeekEnd(date: Date) {
    date = new Date(date);

    const day = date.getDay();
    const diff: number = date.getDate() - day + (day === 0 ? 0 : 7);
    const sunday = new Date(date.setDate(diff));


    return this.getDayEnd(sunday);
  }

}
