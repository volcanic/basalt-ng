import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CalendarComponent} from './calendar.component';
import {CalendarImports} from '../../calendar.imports';
import {CalendarDeclarations} from '../../calendar.declaration';
import {PouchDBService} from '../../../../core/persistence/services/pouchdb.service';
import {PouchDBServiceMock} from '../../../../core/persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../../core/persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../../core/persistence/services/pouchdb-settings.service.mock';
import {TaskletService} from '../../../../core/entity/services/tasklet/tasklet.service';
import {MatchService} from '../../../../core/entity/services/match.service';
import {FilterService} from '../../../../core/entity/services/filter.service';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CalendarImports],
      declarations: [CalendarDeclarations],
      providers: [
        {provide: PouchDBService, useClass: PouchDBServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
        TaskletService,
        MatchService,
        FilterService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
