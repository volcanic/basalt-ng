import {NgModule} from '@angular/core';
import {ChatBubbleComponent} from './chat-bubble/chat-bubble.component';
import {ChatBubbleDeclarations} from './chat-bubble.declaration';
import {ChatBubbleImports} from './chat-bubble.imports';

@NgModule({
  imports: [ChatBubbleImports],
  declarations: [ChatBubbleDeclarations],
  exports: [ChatBubbleComponent]
})
export class ChatBubbleModule {
}
