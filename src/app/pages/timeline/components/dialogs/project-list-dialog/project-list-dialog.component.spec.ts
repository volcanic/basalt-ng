import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectListDialogComponent} from './project-list-dialog.component';
import {TimelineImports} from '../../../timeline.imports';
import {TimelineDeclarations} from '../../../timeline.declaration';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

describe('ProjectListDialogComponent', () => {
  let component: ProjectListDialogComponent;
  let fixture: ComponentFixture<ProjectListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
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
    fixture = TestBed.createComponent(ProjectListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
