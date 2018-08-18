import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WeeklyEffortTreeComponent} from './weekly-effort-tree.component';

describe('WeeklyEffortTreeComponent', () => {
  let component: WeeklyEffortTreeComponent;
  let fixture: ComponentFixture<WeeklyEffortTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WeeklyEffortTreeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyEffortTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
