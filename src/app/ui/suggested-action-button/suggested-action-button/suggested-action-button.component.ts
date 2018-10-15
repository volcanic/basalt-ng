import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-suggested-action-button',
  templateUrl: './suggested-action-button.component.html',
  styleUrls: ['./suggested-action-button.component.scss']
})
export class SuggestedActionButtonComponent {

  /** Button color */
  @Input() backgroundColor: string;
  /** Icon color */
  @Input() iconColor: string;
  /** Name of button icon */
  @Input() icon: string;
  /** Button label */
  @Input() label: string;

  /** Event emitter indicating changes in date */
  @Output() buttonClickedEmitter = new EventEmitter<any>();

  //
  // Actions
  //

  /**
   * Handles click on button
   */
  onButtonClicked() {
    this.buttonClickedEmitter.emit();
  }
}
