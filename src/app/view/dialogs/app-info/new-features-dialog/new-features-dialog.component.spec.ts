import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NewFeaturesDialogComponent} from './new-features-dialog.component';

describe('NewFeaturesDialogComponent', () => {
  let component: NewFeaturesDialogComponent;
  let fixture: ComponentFixture<NewFeaturesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewFeaturesDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFeaturesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
