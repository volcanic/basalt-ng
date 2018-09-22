import {inject, TestBed} from '@angular/core/testing';

import {DateService} from './date.service';

describe('DateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateService]
    });
  });

  it('should be created', inject([DateService], (service: DateService) => {
    expect(service).toBeTruthy();
  }));

  it('should determine which date is before which', inject([DateService], (service: DateService) => {
    const d1 = new Date('2017-12-31');
    const d2 = new Date('2018-01-01');

    expect(DateService.isDayBefore(d1, d2)).toBeTruthy();
  }));

  it('should determine that two similar dates are not before each other', inject([DateService], (service: DateService) => {
    const d1 = new Date('2018-01-01');

    expect(DateService.isDayBefore(d1, d1)).toBeFalsy();
  }));

  it('should determine beginning of the week', inject([DateService], (service: DateService) => {
    const d1 = new Date('2018-01-07');
    expect(DateService.getBeginningOfTheWeek(d1).getDate() === 1).toBeTruthy();
  }));

  it('should determine beginning of the week if given day is Monday', inject([DateService], (service: DateService) => {
    const d1 = new Date('2018-01-01');
    expect(DateService.getBeginningOfTheWeek(d1).getDate() === 1).toBeTruthy();
  }));

  it('should determine end of the week', inject([DateService], (service: DateService) => {
    const d1 = new Date('2018-01-01');
    expect(DateService.getEndOfTheWeek(d1).getDate() === 7).toBeTruthy();
  }));

  it('should determine end of the week if given day is Sunday', inject([DateService], (service: DateService) => {
    const d1 = new Date('2018-01-07');
    expect(DateService.getEndOfTheWeek(d1).getDate() === 7).toBeTruthy();
  }));

  it('should determine end of the week if it is in another month', inject([DateService], (service: DateService) => {
    const d1 = new Date('2018-02-04');
    expect(DateService.getEndOfTheWeek(d1).getDate() === 4 && DateService.getEndOfTheWeek(d1).getMonth() === 2).toBeTruthy();
  }));

  it('should determine given day is its own week', inject([DateService], (service: DateService) => {
    const d1 = new Date('2018-01-07');

    expect(DateService.isInWeek(d1, d1)).toBeTruthy();
  }));

  it('should determine given day is in current week', inject([DateService], (service: DateService) => {
    const d1 = new Date('2018-01-07');
    const today = new Date('2018-01-01');

    expect(DateService.isInWeek(d1, today)).toBeTruthy();
  }));

  it('should determine given day is outside the current week', inject([DateService], (service: DateService) => {
    const d1 = new Date('2018-01-08');
    const today = new Date('2018-01-01');

    expect(DateService.isInWeek(d1, today)).toBeFalsy();
  }));
});
