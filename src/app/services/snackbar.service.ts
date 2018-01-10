import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SnackbarService {

  messageSubject = new Subject<string[]>();

  constructor() {
  }

  showSnackbar(message: string, action: string) {
    this.messageSubject.next([message, action]);
  }
}
