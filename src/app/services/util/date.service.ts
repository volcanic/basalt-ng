import {Injectable} from '@angular/core';

/**
 * Handles dates comparison and arithmetic
 */
@Injectable({
  providedIn: 'root'
})
export class DateService {

  /** Minutes to round up or down to */
  public static MINUTES_INTERVAL = 5;

  //
  // Comparison
  //

  /**
   * Determines whether a given date is before another date
   * @param {Date} d1 first date
   * @param {Date} d2 second date
   * @returns {boolean} true if first date is before seconds date
   */
  static isBefore(d1: Date, d2: Date) {
    return new Date(d1) < new Date(d2);
  }

  /**
   * Determines whether a given date is after another date
   * @param {Date} d1 first date
   * @param {Date} d2 second date
   * @returns {boolean} true if first date is after seconds date
   */
  static isAfter(d1: Date, d2: Date) {
    return new Date(d1) > new Date(d2);
  }

  /**
   * Determines whether a given date is before another date regardless of time
   * @param {Date} d1 first date
   * @param {Date} d2 second date
   * @returns {boolean} true if first date is before the start of seconds date
   */
  static isDayBefore(d1: Date, d2: Date) {
    return new Date(d1).setHours(0, 0, 0, 0) < new Date(d2).setHours(0, 0, 0, 0);
  }

  /**
   * Determines if a given date is before today
   * @param {Date} date date to check
   * @returns {boolean} true if given date is before start of today
   */
  static isBeforeToday(date: Date) {
    return DateService.isBefore(date, new Date(new Date().setHours(0, 0, 0, 0)));
  }

  /**
   * Determines if a given date is inside the current week
   * @param {Date} date date to check
   * @param {Date} now reference date
   * @returns {boolean} true if given date is inside week of reference date
   */
  static isThisWeek(date: Date, now: Date) {
    const beginningOfTheWeek = DateService.getBeginningOfTheWeek(new Date(now));
    const endOfTheWeek = DateService.getEndOfTheWeek(new Date(now));

    return new Date(date) >= beginningOfTheWeek && new Date(date) <= endOfTheWeek;
  }

  //
  // Lookup
  //

  /**
   * Returns the beginning of the week that contains the given date
   * @param {Date} date date to get beginning of the week for
   * @returns {Date} week start of the week containing the given date
   */
  static getBeginningOfTheWeek(date: Date): Date {
    const beginningOfTheWeek = new Date();

    const currentWeekDay = new Date(date).getDay();
    const daysFromMonday = currentWeekDay === 0 ? 6 : currentWeekDay - 1;

    beginningOfTheWeek.setHours(0, 0, 0, 0);
    beginningOfTheWeek.setDate(new Date(date).getDate() - daysFromMonday);

    return beginningOfTheWeek;
  }

  /**
   * Returns the end of the week that contains the given date
   * @param {Date} date date to get end of the week for
   * @returns {Date} week end of the week containing the given date
   */
  static getEndOfTheWeek(date: Date): Date {
    const endOfTheWeek = new Date(date);

    const currentWeekDay = new Date(date).getDay();
    const daysTillSunday = currentWeekDay === 0 ? 0 : 7 - currentWeekDay;

    endOfTheWeek.setHours(23, 59, 59, 0);
    endOfTheWeek.setDate(new Date(date).getDate() + daysTillSunday);

    return endOfTheWeek;
  }

  /**
   * Returns start of a given day
   * @param {Date} date date to get start of
   * @returns {Date} start of a given date
   */
  static getDayStart(date: Date): Date {
    date.setHours(0, 0, 0, 0);

    return new Date(date);
  }

  /**
   * Returns end of a given day
   * @param {Date} date date to get end of
   * @returns {Date} end of a given date
   */
  static getDayEnd(date: Date): Date {
    date.setHours(23, 59, 59, 999);

    return new Date(date);
  }

  /**
   * Returns the beginning of the week that contains a given date
   * @param {Date} date date to get week start from
   * @returns {Date} start of the week containing the given date
   */
  static getWeekStart(date: Date) {
    date = new Date(date);

    const day = date.getDay();
    const diff: number = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));

    return DateService.getDayStart(monday);
  }

  /**
   * Returns the end of the week that contains a given date
   * @param {Date} date date to get week end from
   * @returns {Date} end of the week containing the given date
   */
  static getWeekEnd(date: Date) {
    date = new Date(date);

    const day = date.getDay();
    const diff: number = date.getDate() - day + (day === 0 ? 0 : 7);
    const sunday = new Date(date.setDate(diff));


    return DateService.getDayEnd(sunday);
  }

  //
  // Formatting
  //

  /**
   * Returns the date component of a given date object as a string
   * @param {Date} date date to get string for
   * @returns {string} date string of the given date
   */
  static getDateString(date: Date): string {
    const day = new Date(date).getDate();
    const month = DateService.getMonthString(new Date(date).getMonth());
    const year = new Date(date).getFullYear();
    return `${day} ${month} ${year}`;
  }

  /**
   * Returns the date component of a given date object as a string where the month is shortened
   * @param {Date} date date to get string for
   * @returns {string} date string of the given date
   */
  static getSimpleDateString(date: Date): string {
    const day = new Date(date).getDate();
    const month = DateService.getMonthString(new Date(date).getMonth()).slice(0, 3);
    const year = new Date(date).getFullYear();
    return `${day} ${month} ${year}`;
  }

  /**
   * Returns the time component of a given date object as a string
   * @param {Date} date date to get string for
   * @returns {string} time string of the given date
   */
  static getTimeString(date: Date): string {
    if (date != null) {
      let hours = new Date(date).getHours();
      let minutes = DateService.getRoundedMinutes(new Date(date).getMinutes());

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

  /**
   * Returns the day of a month as a string
   * @param {Date} date date to get string for
   * @returns {string} month string of the given date
   */
  static getDayOfMonthString(date: Date): string {
    return new Date(date).getDate().toString();
  }

  /**
   * Returns the weekday string of a given weekday
   * @param {number} weekday index of the week, where 0 is Sunday
   * @returns {string} weekday string of the given index
   */
  static getWeekDayString(weekday: number) {
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

  /**
   * Returns the month string of a given month
   * @param {number} month index of the month, where 0 is January
   * @returns {string} month string of the given index
   */
  static getMonthString(month: number) {
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

    return '';
  }

  //
  // Helpers
  //

  /**
   * Rounds a given number of minutes to MINUTES_INTERVAL
   * @param {number} minutes minutes to round
   * @returns {number} rounded minutes
   */
  static getRoundedMinutes(minutes: number): number {
    return Math.ceil(minutes / DateService.MINUTES_INTERVAL) * DateService.MINUTES_INTERVAL;
  }
}
