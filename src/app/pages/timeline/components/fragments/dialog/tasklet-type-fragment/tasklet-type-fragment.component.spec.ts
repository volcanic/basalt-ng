import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletTypeFragmentComponent} from './tasklet-type-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';
import {PouchDBService} from '../../../../../../core/persistence/services/pouchdb.service';
import {PouchDBServiceMock} from '../../../../../../core/persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../../../../core/persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../../../../core/persistence/services/pouchdb-settings.service.mock';
import {ColorService} from '../../../../../../core/ui/services/color.service';
import {FeatureService} from '../../../../../../core/settings/services/feature.service';
import {TaskletService} from '../../../../../../core/entity/services/tasklet/tasklet.service';
import {MaterialColorService} from '../../../../../../core/ui/services/material-color.service';
import {SettingsService} from '../../../../../../core/settings/services/settings.service';

describe('TaskletTypeFragmentComponent', () => {
  let component: TaskletTypeFragmentComponent;
  let fixture: ComponentFixture<TaskletTypeFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
      providers: [
        ColorService,
        FeatureService,
        MaterialColorService,
        SettingsService,
        TaskletService,
        {provide: PouchDBService, useClass: PouchDBServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletTypeFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
