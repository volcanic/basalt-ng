import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TaskletsComponent} from './tasklets.component';

describe('TaskletsComponent', () => {
  let component: TaskletsComponent;
  let fixture: ComponentFixture<TaskletsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskletsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
