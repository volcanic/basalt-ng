import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NewFeaturesDialogComponent} from './new-features-dialog.component';
import {NewFeaturesDialogImports} from '../new-features-dialog.imports';
import {NewFeaturesDialogDeclarations} from '../new-features-dialog.declaration';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

describe('NewFeaturesDialogComponent', () => {
  let component: NewFeaturesDialogComponent;
  let fixture: ComponentFixture<NewFeaturesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NewFeaturesDialogImports],
      declarations: [NewFeaturesDialogDeclarations],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}}, {
          provide: MatDialogRef, useValue: {
            close: jasmine.createSpy('close')
          }
        }
      ],
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
