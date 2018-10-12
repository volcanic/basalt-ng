import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBubbleComponent } from './chat-bubble.component';

describe('ChatBubbleComponent', () => {
  let component: ChatBubbleComponent;
  let fixture: ComponentFixture<ChatBubbleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatBubbleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
