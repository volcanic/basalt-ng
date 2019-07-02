import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChatBubbleComponent} from './chat-bubble.component';
import {ChatBubbleImports} from '../chat-bubble.imports';
import {ChatBubbleDeclarations} from '../chat-bubble.declaration';

describe('ChatBubbleComponent', () => {
  let component: ChatBubbleComponent;
  let fixture: ComponentFixture<ChatBubbleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ChatBubbleImports],
      declarations: [ChatBubbleDeclarations],
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
