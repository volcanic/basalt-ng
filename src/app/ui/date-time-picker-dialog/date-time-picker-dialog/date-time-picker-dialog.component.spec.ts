import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DateTimePickerDialogComponent} from './date-time-picker-dialog.component';
import {DateTimePickerDialogImports} from '../date-time-picker-dialog.imports';
import {DateTimePickerDialogDeclarations} from '../date-time-picker-dialog.declaration';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';


describe('DateTimePickerDialogComponent', () => {
  let component: DateTimePickerDialogComponent;
  let fixture: ComponentFixture<DateTimePickerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DateTimePickerDialogImports],
      declarations: [DateTimePickerDialogDeclarations],
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
    fixture = TestBed.createComponent(DateTimePickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
