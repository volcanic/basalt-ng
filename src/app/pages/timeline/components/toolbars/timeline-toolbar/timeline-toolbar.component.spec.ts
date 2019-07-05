import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TimelineToolbarComponent} from './timeline-toolbar.component';
import {TimelineImports} from '../../../timeline.imports';
import {TimelineDeclarations} from '../../../timeline.declaration';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('TimelineToolbarComponent', () => {
  let component: TimelineToolbarComponent;
  let fixture: ComponentFixture<TimelineToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports, BrowserAnimationsModule],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
