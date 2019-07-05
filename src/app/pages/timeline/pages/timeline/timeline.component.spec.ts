import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TimelineComponent} from './timeline.component';
import {TimelineImports} from '../../timeline.imports';
import {TimelineDeclarations} from '../../timeline.declaration';
import {PouchDBService} from '../../../../core/persistence/services/pouchdb.service';
import {PouchDBMServiceMock} from '../../../../core/persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../../core/persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../../core/persistence/services/pouchdb-settings.service.mock';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {DigestService} from '../../../../core/digest/services/digest/digest.service';
import {EmailService} from '../../../../core/mail/services/mail/email.service';
import {EntityService} from '../../../../core/entity/services/entity.service';
import {FilterService} from '../../../../core/entity/services/filter.service';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {MatchService} from '../../../../core/entity/services/match.service';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {MediaService} from '../../../../core/ui/services/media.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ScopeService} from '../../../../core/entity/services/scope.service';
import {ScrollDispatcher} from '@angular/cdk/overlay';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {SuggestionService} from '../../../../core/entity/services/suggestion.service';
import {PersonService} from '../../../../core/entity/services/person.service';
import {ProjectService} from '../../../../core/entity/services/project.service';
import {TagService} from '../../../../core/entity/services/tag.service';
import {TaskService} from '../../../../core/entity/services/task/task.service';
import {TaskletService} from '../../../../core/entity/services/tasklet/tasklet.service';
import {NgZone} from '@angular/core';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
      providers: [
        DigestService,
        EmailService,
        EntityService,
        FilterService,
        MatIconRegistry,
        MatchService,
        MaterialColorService,
        MaterialIconService,
        MediaService,
        Router,
        DomSanitizer,
        ScopeService,
        ScrollDispatcher,
        SnackbarService,
        SuggestionService,
        PersonService,
        ProjectService,
        SettingsService,
        TagService,
        TaskService,
        TaskletService,
        MatDialog,
        NgZone,
        {provide: PouchDBService, useClass: PouchDBMServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
