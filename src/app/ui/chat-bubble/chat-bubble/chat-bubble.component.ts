import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Displays a chat message
 */
@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss']
})
export class ChatBubbleComponent implements OnInit {

  /** Text to be displayed */
  @Input() text: string;
  /** Background color */
  @Input() color: string;
  /** Text color */
  @Input() textColor: string;
  /** Alignment */
  @Input() alignment: 'left' | 'right';
  /** Event emitter indicating bubble deletion */
  @Output() chatBubbleDeletionEmitter = new EventEmitter<any>();

  /** List of text parts */
  textParts: string[] = [];

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializetTextParts();
  }

  //
  // Initialization
  //

  /**
   * Initializes text parts
   */
  private initializetTextParts() {
    this.textParts = this.text.split('\n').map(p => {
      return p.trim();
    });
  }

  //
  // Actions
  //

  /**
   * Handles deletion of a chat bubble
   */
  onDeleteChatBubble() {
    this.chatBubbleDeletionEmitter.emit();
  }
}
