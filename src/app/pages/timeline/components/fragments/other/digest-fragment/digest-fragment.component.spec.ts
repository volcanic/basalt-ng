import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DigestFragmentComponent} from './digest-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';
import {PouchDBService} from '../../../../../../core/persistence/services/pouchdb.service';
import {PouchDBServiceMock} from '../../../../../../core/persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../../../../core/persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../../../../core/persistence/services/pouchdb-settings.service.mock';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('DigestFragmentComponent', () => {
  let component: DigestFragmentComponent;
  let fixture: ComponentFixture<DigestFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports, BrowserAnimationsModule],
      declarations: [TimelineDeclarations],
      providers: [
        {provide: PouchDBService, useClass: PouchDBServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigestFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
