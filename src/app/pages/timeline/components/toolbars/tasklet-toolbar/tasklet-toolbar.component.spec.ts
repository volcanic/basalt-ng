import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletToolbarComponent} from './tasklet-toolbar.component';
import {TimelineImports} from '../../../timeline.imports';
import {TimelineDeclarations} from '../../../timeline.declaration';

describe('SettingsToolbarComponent', () => {
  let component: TaskletToolbarComponent;
  let fixture: ComponentFixture<TaskletToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
