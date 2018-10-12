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
    const link = `mailto:`
      + (recipients != null && recipients.length > 0 ? `${recipients.join(',')}` : '')
      // + (carbonCopy != null && carbonCopy.length > 0 ? `?cc=${carbonCopy.join(',')}` : '')
      + (subject != null && subject.length > 0 ? `?subject=${escape(subject)}` : '')
      + (text != null && text.length > 0 ? `&body=${escape(text)}` : '');

    window.location.href = link;
  }
}
