import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TimelineToolbarComponent} from './tasklets-toolbar.component';

describe('TimelineToolbarComponent', () => {
  let component: TimelineToolbarComponent;
  let fixture: ComponentFixture<TimelineToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineToolbarComponent]
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
