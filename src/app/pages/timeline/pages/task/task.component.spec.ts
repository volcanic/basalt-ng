import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskComponent} from './task.component';
import {TimelineImports} from '../../timeline.imports';
import {TimelineDeclarations} from '../../timeline.declaration';
import {PouchDBService} from '../../../../core/persistence/services/pouchdb.service';
import {PouchDBServiceMock} from '../../../../core/persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../../core/persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../../core/persistence/services/pouchdb-settings.service.mock';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports, HttpClientModule, BrowserAnimationsModule, RouterTestingModule],
      declarations: [TimelineDeclarations],
      providers: [
        MaterialIconService,
        {provide: PouchDBService, useClass: PouchDBServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
        {
          provide: ActivatedRoute, useValue: {
            params: of({id: 'mock'})
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
