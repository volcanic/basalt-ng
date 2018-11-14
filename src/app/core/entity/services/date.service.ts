import {Injectable} from '@angular/core';
import {RecurrenceInterval} from '../model/recurrence-interval.enum';

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
  // Manipulation
  //

  /**
   * Adds minutes to a given date
   * @param date original date
   * @param minutes minutes to add
   */
  static addMinutes(date: Date, minutes: number) {
    if (date != null) {
      return new Date(date.getTime() + minutes * 60000);
    } else {
      return null;
    }
  }

  /**
   * Adds days to a given date
   * @param date original date
   * @param days days to add
   */
  static addDays(date: Date, days: number) {
    if (date != null) {
      const d = new Date(date);
      d.setDate(d.getDate() + days);
      return d;
    } else {
      return null;
    }
  }

  /**
   * Adds months to a given date
   * @param date original date
   * @param months months to add
   */
  static addMonths(date: Date, months: number) {
    if (date != null) {
      const d = new Date(date);
      d.setMonth(d.getMonth() + months);
      return d;
    } else {
      return null;
    }
  }

  //
  // Comparison
  //

  /**
   * Determines if a given date is today
   * @param {Date} date date to check
   * @returns {boolean} true if given date is today
   */
  static isToday(date: Date): boolean {
    if (date != null) {
      const now = new Date();

      return DateService.isAfter(date, DateService.getDayStart(now)) &&
        DateService.isBefore(date, DateService.getDayEnd(now));
    } else {
      return false;
    }
  }

  /**
   * Determines whether a given date is before another date
   * @param {Date} d1 first date
   * @param {Date} d2 second date
   * @returns {boolean} true if first date is before seconds date
   */
  static isBefore(d1: Date, d2: Date): boolean {
    return new Date(d1) < new Date(d2);
  }

  /**
   * Determines whether a given date is after another date
   * @param {Date} d1 first date
   * @param {Date} d2 second date
   * @returns {boolean} true if first date is after seconds date
   */
  static isAfter(d1: Date, d2: Date): boolean {
    return new Date(d1) > new Date(d2);
  }

  /**
   * Determines whether a given date is before another date regardless of time
   * @param {Date} d1 first date
   * @param {Date} d2 second date
   * @returns {boolean} true if first date is before the start of seconds date
   */
  static isDayBefore(d1: Date, d2: Date): boolean {
    return new Date(d1).setHours(0, 0, 0, 0) < new Date(d2).setHours(0, 0, 0, 0);
  }

  /**
   * Determines if a given date is before now
   * @param {Date} date date to check
   * @returns {boolean} true if given date is before now
   */
  static isBeforeNow(date: Date): boolean {
    return DateService.isBefore(date, new Date());
  }

  /**
   * Determines if a given date is before today
   * @param {Date} date date to check
   * @returns {boolean} true if given date is before start of today
   */
  static isBeforeToday(date: Date): boolean {
    return DateService.isBefore(date, new Date(new Date().setHours(0, 0, 0, 0)));
  }

  /**
   * Determines if a given date is inside a week
   * @param {Date} date date to check
   * @param {Date} referenceDate reference date
   * @returns {boolean} true if given date is inside week of reference date
   */
  static isInWeek(date: Date, referenceDate: Date): boolean {
    const beginningOfTheWeek = DateService.getBeginningOfTheWeek(new Date(referenceDate));
    const endOfTheWeek = DateService.getEndOfTheWeek(new Date(referenceDate));

    return new Date(date) >= beginningOfTheWeek && new Date(date) <= endOfTheWeek;
  }

  /**
   * Determines if a given date is inside the current week
   * @param {Date} date date to check
   * @returns {boolean} true if given date is inside current week
   */
  static isInCurrentWeek(date: Date): boolean {
    return DateService.isInWeek(date, new Date());
  }

  /**
   * Determines whether a given date is within a certain amount of days in the past
   * @param {Date} date date to be checked
   * @param {number} days number of days in range
   * @return {boolean} true if given date is within range
   */
  static isWithinNextDays(date: Date, days: number): boolean {
    const rangeEnd = new Date().setDate(new Date(date).getDate() + days);
    return new Date(date) < new Date(rangeEnd);
  }

  /**
   * Determines whether a given date is within a certain amount of days in the past
   * @param {Date} date date to be checked
   * @param {number} days number of days in range
   * @return {boolean} true if given date is within range
   */
  static isWithinLastDays(date: Date, days: number): boolean {
    const rangeStart = new Date().setDate(new Date(date).getDate() - days);
    return new Date(date) > new Date(rangeStart);
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
  static getWeekStart(date: Date): Date {
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
  static getWeekEnd(date: Date): Date {
    date = new Date(date);

    const day = date.getDay();
    const diff: number = date.getDate() - day + (day === 0 ? 0 : 7);
    const sunday = new Date(date.setDate(diff));


    return DateService.getDayEnd(sunday);
  }

  //
  // Diff
  //

  /**
   * Returns the difference of two dates in milliseconds
   * @param one first date
   * @param two second date
   */
  static getDiffInMilliseconds(one: Date, two: Date) {
    return new Date(one).getTime() - new Date(two).getTime();
  }

  /**
   * Returns the difference of two dates in seconds
   * @param one first date
   * @param two second date
   */
  static diffInSeconds(one: Date, two: Date): number {
    return Math.floor(DateService.getDiffInMilliseconds(one, two) / 1000);
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
   * Returns the date component of a given date object as a string where the month is shortened and the year is omitted
   * @param {Date} date date to get string for
   * @returns {string} date string of the given date
   */
  static getSimpleDateWithoutYearString(date: Date): string {
    const day = new Date(date).getDate();
    const month = DateService.getMonthString(new Date(date).getMonth()).slice(0, 3);
    return `${day} ${month}`;
  }

  /**
   * Returns a date string of a given range (omits du
   * @param {Date} start start date
   * @param {Date} end end date
   * @returns {string} string of the given range
   */
  static getDateRangeString(start: Date, end: Date): string {
    const sameMonth = start.getMonth() === end.getMonth();
    const sameYear = start.getFullYear() === end.getFullYear();

    let dateStringStart = DateService.getSimpleDateString(start);
    const dateStringEnd = DateService.getSimpleDateString(end);

    if (sameMonth) {
      const month = DateService.getMonthString(new Date(start).getMonth()).slice(0, 3);
      dateStringStart = dateStringStart.replace(month, '').trim();
    }

    if (sameYear) {
      const year = new Date(start).getFullYear().toString();
      dateStringStart = dateStringStart.replace(year, '').trim();
    }

    return dateStringStart + ' - ' + dateStringEnd;
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

      const hoursString = DateService.getTwoCharacterString(hours);
      const minutesString = DateService.getTwoCharacterString(minutes);

      return `${hoursString}:${minutesString}`
        ;
    } else {
      return '';
    }
  }

  /**
   * Returns a string representing minutes (might be negative)
   * @param seconds
   */
  static getMinutesString(seconds: number): string {
    const negative = seconds < 0;
    const diffMin = Math.abs(Math.floor(seconds / 60));
    const diffSec = Math.abs(Math.floor(seconds % 60));

    return `${negative ? '-' : ''}${DateService.getTwoCharacterString(diffMin)}:${DateService.getTwoCharacterString(diffSec)}`;
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
  static getMonthString(month: number): string {
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

  /**
   * Returns a string of a given recurrence interval
   * @param {RecurrenceInterval} recurrenceInterval recurrence interval
   * @returns {string} string of the given recurrence interval
   */
  static getRecurrenceIntervalString(recurrenceInterval: RecurrenceInterval): string {
    return recurrenceInterval.toString();
  }

  /**
   * Returns the calendar week number of a given date
   * @param {Date} date date to get calendar week number for
   * @returns {number} calendar week number
   */
  static getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  /**
   * Returns a string that has at least two characters (used for displaying hours and minutes)
   * @param value numeric value
   * @return two-character string
   */
  static getTwoCharacterString(value: number): string {
    return (value < 10) ?
      `0${value}`
      : value.toString();
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
