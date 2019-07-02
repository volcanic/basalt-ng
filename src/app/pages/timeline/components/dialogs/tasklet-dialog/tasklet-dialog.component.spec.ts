import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletDialogComponent} from './tasklet-dialog.component';
import {TimelineImports} from '../../../timeline.imports';
import {TimelineDeclarations} from '../../../timeline.declaration';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PouchDBService} from '../../../../../core/persistence/services/pouchdb.service';
import {PouchDBMServiceMock} from '../../../../../core/persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../../../core/persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../../../core/persistence/services/pouchdb-settings.service.mock';

describe('TaskletDialogComponent', () => {
  let component: TaskletDialogComponent;
  let fixture: ComponentFixture<TaskletDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
      providers: [
        {provide: PouchDBService, useClass: PouchDBMServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
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
    fixture = TestBed.createComponent(TaskletDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
