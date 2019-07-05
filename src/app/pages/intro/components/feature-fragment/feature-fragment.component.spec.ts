import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeatureFragmentComponent} from './feature-fragment.component';
import {IntroImports} from '../../intro.imports';
import {IntroDeclarations} from '../../intro.declaration';
import {PouchDBService} from '../../../../core/persistence/services/pouchdb.service';
import {PouchDBServiceMock} from '../../../../core/persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../../core/persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../../core/persistence/services/pouchdb-settings.service.mock';

describe('FeatureFragmentComponent', () => {
  let component: FeatureFragmentComponent;
  let fixture: ComponentFixture<FeatureFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IntroImports],
      declarations: [IntroDeclarations],
      providers: [
        {provide: PouchDBService, useClass: PouchDBServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
