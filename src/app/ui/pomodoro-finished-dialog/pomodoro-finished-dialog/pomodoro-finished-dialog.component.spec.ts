import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PomodoroFinishedDialogComponent} from './pomodoro-finished-dialog.component';
import {PomodoroFinishedDialogImports} from '../pomodoro-finished-dialog.imports';
import {PomodoroFinishedDialogDeclarations} from '../pomodoro-finished-dialog.declaration';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

describe('PomodoroFinishedDialogComponent', () => {
  let component: PomodoroFinishedDialogComponent;
  let fixture: ComponentFixture<PomodoroFinishedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PomodoroFinishedDialogImports],
      declarations: [PomodoroFinishedDialogDeclarations],
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
    fixture = TestBed.createComponent(PomodoroFinishedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
