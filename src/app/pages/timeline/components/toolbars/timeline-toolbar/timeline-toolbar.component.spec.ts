import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TimelineToolbarComponent} from './timeline-toolbar.component';
import {TimelineImports} from '../../../timeline.imports';
import {TimelineDeclarations} from '../../../timeline.declaration';

describe('SettingsToolbarComponent', () => {
  let component: TimelineToolbarComponent;
  let fixture: ComponentFixture<TimelineToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
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
