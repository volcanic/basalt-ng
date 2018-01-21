import {Injectable} from '@angular/core';

@Injectable()
export class DateService {

  constructor() {
  }

  getTime(date: Date): string {
    if (date != null) {
      const MINUTES_INTERVAL = 5;

      let hours = new Date(date).getHours();
      let minutes = Math.ceil(new Date(date).getMinutes() / MINUTES_INTERVAL) * MINUTES_INTERVAL;

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
}
