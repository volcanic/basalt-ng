import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsComponent} from './settings.component';
import {SettingsImports} from '../../settings.imports';
import {SettingsDeclarations} from '../../settings.declaration';
import {MatIconRegistry} from '@angular/material';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ScrollDispatcher} from '@angular/cdk/overlay';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {NgZone} from '@angular/core';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SettingsImports],
      declarations: [SettingsDeclarations],
      providers: [
        MatIconRegistry,
        MaterialColorService,
        MaterialIconService,
        {
          provide: Router, useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        },
        DomSanitizer,
        ScrollDispatcher,
        SettingsService,
        NgZone
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
