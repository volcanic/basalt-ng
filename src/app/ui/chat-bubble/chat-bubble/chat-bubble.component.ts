import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Displays a chat message
 */
@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss']
})
export class ChatBubbleComponent {

  /** Text to be displayed */
  @Input() text: string;
  /** Background personColor */
  @Input() color: string;
  /** Text personColor */
  @Input() textColor: string;
  /** Alignment */
  @Input() alignment: 'left' | 'right';
  /** Readonly if true */
  @Input() readonly = false;
  /** Event emitter indicating bubble change */
  @Output() chatBubbleChangeEmitter = new EventEmitter<string>();
  /** Event emitter indicating bubble deletion */
  @Output() chatBubbleDeletionEmitter = new EventEmitter<any>();

  //
  // Actions
  //

  /**
   * Handles deletion of a chat bubble
   */
  onDeleteChatBubble() {
    this.chatBubbleDeletionEmitter.emit();
  }

  /**
   * Handles change of a chat bubble text
   * @param text text
   */
  onTextChanged(text: string) {
    this.chatBubbleChangeEmitter.emit(text);
  }

  /**
   * Handles key down event
   * @param event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (!this.isMultiLine() && event.keyCode === KEY_CODE_ENTER) {
      this.text += '\n';
    }
  }

  //
  // Actions
  //

  /**
   * Determines whether the text has multiple lines
   */
  isMultiLine() {
    return this.text.includes(`\n`);
  }
}
