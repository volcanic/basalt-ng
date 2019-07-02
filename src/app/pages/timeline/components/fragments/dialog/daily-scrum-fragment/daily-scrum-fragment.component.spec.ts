import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DailyScrumFragmentComponent} from './daily-scrum-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';
import {PouchDBService} from '../../../../../../core/persistence/services/pouchdb.service';
import {PouchDBMServiceMock} from '../../../../../../core/persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../../../../core/persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../../../../core/persistence/services/pouchdb-settings.service.mock';

describe('DailyScrumFragmentComponent', () => {
  let component: DailyScrumFragmentComponent;
  let fixture: ComponentFixture<DailyScrumFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
      providers: [
        {provide: PouchDBService, useClass: PouchDBMServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyScrumFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
