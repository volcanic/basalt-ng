import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DailyEffortTreeComponent} from './daily-effort-tree.component';

describe('DailyEffortTreeComponent', () => {
  let component: DailyEffortTreeComponent;
  let fixture: ComponentFixture<DailyEffortTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DailyEffortTreeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyEffortTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
