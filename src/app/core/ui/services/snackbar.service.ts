import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

/**
 * Handles snack bars
 */
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  /** Subject that publishes messages to be shown in a snack bar */
  messageSubject = new Subject<string[]>();

  /**
   * Shows snackbar with a given message
   * @param {string} message
   */
  showSnackbar(message: string) {
    this.messageSubject.next([message, '', null]);
  }

  /**
   * Shows snackbar with a given message, an action name and an action which is triggered when action is clicked
   * @param {string} message
   * @param {string} actionName
   * @param action
   */
  showSnackbarWithAction(message: string, actionName: string, action: any) {
    this.messageSubject.next([message, actionName, action]);
  }
}
