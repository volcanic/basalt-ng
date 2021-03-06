import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletComponent} from './tasklet.component';
import {TimelineImports} from '../../timeline.imports';
import {TimelineDeclarations} from '../../timeline.declaration';
import {PouchDBService} from '../../../../core/persistence/services/pouchdb.service';
import {PouchDBServiceMock} from '../../../../core/persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../../core/persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../../core/persistence/services/pouchdb-settings.service.mock';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {ColorService} from '../../../../core/ui/services/color.service';
import {EmailService} from '../../../../core/mail/services/mail/email.service';
import {FilterService} from '../../../../core/entity/services/filter.service';
import {MediaService} from '../../../../core/ui/services/media.service';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {PersonService} from '../../../../core/entity/services/person/person.service';
import {ProjectService} from '../../../../core/entity/services/project/project.service';
import {ScopeService} from '../../../../core/entity/services/scope.service';
import {ScrollDispatcher} from '@angular/cdk/overlay';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {SuggestionService} from '../../../../core/entity/services/suggestion.service';
import {TagService} from '../../../../core/entity/services/tag/tag.service';
import {TaskletService} from '../../../../core/entity/services/tasklet/tasklet.service';
import {TaskService} from '../../../../core/entity/services/task/task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {NgZone} from '@angular/core';
import {of} from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

xdescribe('TaskletComponent', () => {
  let component: TaskletComponent;
  let fixture: ComponentFixture<TaskletComponent>;

  const mockNgZone = jasmine.createSpyObj('mockNgZone', ['run', 'runOutsideAngular']);
  mockNgZone.run.and.callFake(fn => fn());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports, HttpClientModule, BrowserAnimationsModule],
      declarations: [TimelineDeclarations],
      providers: [
        ColorService,
        EmailService,
        FilterService,
        MediaService,
        MaterialColorService,
        MaterialIconService,
        PersonService,
        ProjectService,
        ScopeService,
        ScrollDispatcher,
        SettingsService,
        SnackbarService,
        SuggestionService,
        TagService,
        TaskletService,
        TaskService,
        {
          provide: Router, useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        },
        MatIconRegistry,
        DomSanitizer,
        MatDialog,
        {provide: NgZone, useValue: mockNgZone},
        {provide: PouchDBService, useClass: PouchDBServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
        {
          provide: ActivatedRoute, useValue: {
            params: of({id: 'mock'})
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
