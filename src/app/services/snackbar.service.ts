import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class SnackbarService {

  messageSubject = new Subject<string[]>();

  constructor() {
  }

  showSnackbar(message: string) {
    this.messageSubject.next([message, '', null]);
  }

  showSnackbarWithAction(message: string, actionName: string, action: any) {
    this.messageSubject.next([message, actionName, action]);
  }
}
