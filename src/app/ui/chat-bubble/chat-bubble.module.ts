import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatBubbleComponent} from './chat-bubble/chat-bubble.component';
import {MatIconModule, MatInputModule} from '@angular/material';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatInputModule
  ],
  declarations: [ChatBubbleComponent],
  exports: [ChatBubbleComponent]
})
export class ChatBubbleModule {
}
