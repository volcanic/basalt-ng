import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RecurrenceIntervalFragmentComponent} from './recurrence-interval-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';
import {PouchDBService} from '../../../../../../core/persistence/services/pouchdb.service';
import {PouchDBServiceMock} from '../../../../../../core/persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../../../../core/persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../../../../core/persistence/services/pouchdb-settings.service.mock';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('RecurrenceIntervalFragmentComponent', () => {
  let component: RecurrenceIntervalFragmentComponent;
  let fixture: ComponentFixture<RecurrenceIntervalFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports, BrowserAnimationsModule],
      declarations: [TimelineDeclarations],
      providers: [
        {provide: PouchDBService, useClass: PouchDBServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurrenceIntervalFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
