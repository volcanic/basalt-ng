import { ChatBubbleModule } from './chat-bubble.module';

describe('ChatBubbleModule', () => {
  let chatBubbleModule: ChatBubbleModule;

  beforeEach(() => {
    chatBubbleModule = new ChatBubbleModule();
  });

  it('should create an instance', () => {
    expect(chatBubbleModule).toBeTruthy();
  });
});
