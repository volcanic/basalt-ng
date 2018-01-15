import {Injectable} from '@angular/core';

@Injectable()
export class DateService {

  constructor() {
  }

  getTime(date: Date): string {
    if (date != null) {
      let MINUTES_INTERVAL = 5;

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
    let weekday = this.getWeekDayString(new Date(date).getDay());
    let day = new Date(date).getDate();
    let month = this.getMonthString(new Date(date).getMonth());
    let year = new Date(date).getFullYear();
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
}
