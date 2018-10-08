import {Injectable} from '@angular/core';

/**
 * Handles email actions
 */
@Injectable({
  providedIn: 'root'
})
export class EmailService {

  /**
   * Opens a mail client with predefined values
   * @param recipients recipient
   * @param carbonCopy recipients on cc
   * @param subject subject
   * @param text text
   */
  sendMail(recipients: string[], carbonCopy: string[], subject: string, text: string) {
    window.location.href = `mailto:${recipients.join(';')}`
      + `?cc=${carbonCopy.join(',')}`
      + `&subject=${escape(subject)}`
      + `&body=${escape(text)}`
    ;
  }
}
