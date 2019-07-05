import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmationDialogComponent} from './confirmation-dialog.component';
import {ConfirmationDialogImports} from '../confirmation-dialog.imports';
import {ConfirmationDialogDeclarations} from '../confirmation-dialog.declaration';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmationDialogImports],
      declarations: [ConfirmationDialogDeclarations],
      providers: [
        {
          provide: MAT_DIALOG_DATA, useValue: {}
        },
        {
          provide: MatDialogRef, useValue: {
            close: jasmine.createSpy('close')
          }
        }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
