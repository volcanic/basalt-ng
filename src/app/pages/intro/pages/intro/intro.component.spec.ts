import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IntroComponent} from './intro.component';
import {IntroImports} from '../../intro.imports';
import {IntroDeclarations} from '../../intro.declaration';
import {FeatureService} from '../../../../core/settings/services/feature.service';
import {MediaService} from '../../../../core/ui/services/media.service';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {Router} from '@angular/router';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('IntroComponent', () => {
  let component: IntroComponent;
  let fixture: ComponentFixture<IntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IntroImports, BrowserAnimationsModule, HttpClientModule],
      declarations: [IntroDeclarations],
      providers: [
        FeatureService,
        MediaService,
        MaterialColorService,
        MaterialIconService,
        SettingsService,
        {
          provide: Router, useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        },
        MatDialog,
        MatIconRegistry,
        {
          provide: DomSanitizer,
          useValue: {
            sanitize: () => 'safeString',
            bypassSecurityTrustHtml: () => 'safeString',
            bypassSecurityTrustResourceUrl: () => 'safeString'
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
