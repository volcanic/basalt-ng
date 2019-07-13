import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPopoverComponent } from './color-popover.component';

describe('ColorPopoverComponent', () => {
  let component: ColorPopoverComponent;
  let fixture: ComponentFixture<ColorPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
