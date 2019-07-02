import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InformationDialogComponent} from './information-dialog.component';
import {InformationDialogImports} from '../information-dialog.imports';
import {InformationDialogDeclarations} from '../information-dialog.declaration';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

describe('InformationDialogComponent', () => {
  let component: InformationDialogComponent;
  let fixture: ComponentFixture<InformationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InformationDialogImports],
      declarations: [InformationDialogDeclarations],
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
    fixture = TestBed.createComponent(InformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
