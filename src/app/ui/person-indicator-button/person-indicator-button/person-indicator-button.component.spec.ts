import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonIndicatorButtonComponent } from './person-indicator-button.component';

describe('PersonIndicatorButtonComponent', () => {
  let component: PersonIndicatorButtonComponent;
  let fixture: ComponentFixture<PersonIndicatorButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonIndicatorButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonIndicatorButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
