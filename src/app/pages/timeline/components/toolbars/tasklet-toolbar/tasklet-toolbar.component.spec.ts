import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletToolbarComponent} from './tasklet-toolbar.component';

describe('SettingsToolbarComponent', () => {
  let component: TaskletToolbarComponent;
  let fixture: ComponentFixture<TaskletToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskletToolbarComponent]
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
