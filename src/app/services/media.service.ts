import {Injectable} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {MEDIA} from '../model/media.enum';
import {Subject} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  media: MEDIA;
  mediaSubject = new Subject<MEDIA>();

  constructor(public breakpointObserver: BreakpointObserver) {

    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.media = MEDIA.SMALL;
          this.notify();
        }
      });
    this.breakpointObserver
      .observe([Breakpoints.Medium])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.media = MEDIA.MEDIUM;
          this.notify();
        }
      });
    this.breakpointObserver
      .observe([Breakpoints.Large])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.media = MEDIA.LARGE;
          this.notify();
        }
      });
  }

  private notify() {
    console.log(`DEBUG media ${this.media}`);
    this.mediaSubject.next(this.media);
  }
}
