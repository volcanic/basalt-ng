import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatBubbleComponent} from './chat-bubble/chat-bubble.component';
import {MatIconModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  declarations: [ChatBubbleComponent],
  exports: [ChatBubbleComponent]
})
export class ChatBubbleModule {
}
