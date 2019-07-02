import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {AppImports} from './app.imports';
import {PouchDBMServiceMock} from './core/persistence/services/pouchdb.service.mock';
import {PouchDBService} from './core/persistence/services/pouchdb.service';
import {EntityService} from './core/entity/services/entity.service';
import {TaskService} from './core/entity/services/task/task.service';
import {TaskletService} from './core/entity/services/tasklet/tasklet.service';
import {SnackbarService} from './core/ui/services/snackbar.service';
import {SettingsService} from './core/settings/services/settings.service';
import {ThemeService} from './core/ui/services/theme.service';
import {OverlayContainer} from '@angular/cdk/overlay';
import {MatSnackBar} from '@angular/material';
import {PouchDBSettingsService} from './core/persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from './core/persistence/services/pouchdb-settings.service.mock';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {AppDeclarations} from './app.declarations';

describe('AppComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppImports],
      declarations: [AppDeclarations],
      providers: [
        EntityService,
        TaskService,
        TaskletService,
        SnackbarService,
        {provide: PouchDBService, useClass: PouchDBMServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
        SettingsService,
        ThemeService,
        OverlayContainer,
        MatSnackBar
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
