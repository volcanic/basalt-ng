import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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
  /** Background color */
  @Input() color: string;
  /** Text color */
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
}
