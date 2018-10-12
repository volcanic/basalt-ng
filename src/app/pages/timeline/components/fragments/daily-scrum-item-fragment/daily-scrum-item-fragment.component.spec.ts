import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyScrumItemFragmentComponent } from './daily-scrum-item-fragment.component';

describe('DailyScrumItemFragmentComponent', () => {
  let component: DailyScrumItemFragmentComponent;
  let fixture: ComponentFixture<DailyScrumItemFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyScrumItemFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyScrumItemFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
