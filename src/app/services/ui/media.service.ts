import {Injectable} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {MEDIA} from '../../model/ui/media.enum';
import {Subject} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  media: MEDIA;
  mediaSubject = new Subject<MEDIA>();

  constructor(public breakpointObserver: BreakpointObserver) {

    this.initializeSize();

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

  private initializeSize() {

    const innerWidth = window.innerWidth;

    if (innerWidth < 960) {
      this.media = MEDIA.SMALL;
      this.notify();
    } else if (innerWidth >= 960 && innerWidth < 1280) {
      this.media = MEDIA.MEDIUM;
      this.notify();
    } else if (innerWidth > 1280) {
      this.media = MEDIA.LARGE;
      this.notify();
    }
  }

  private notify() {
    this.mediaSubject.next(this.media);
  }
}
