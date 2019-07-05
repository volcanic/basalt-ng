import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NotificationComponent} from './notification.component';
import {StartImports} from '../../start.imports';
import {CalendarDeclarations} from '../../start.declaration';
import {NotificationService} from '../../../../core/notification/services/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StartImports],
      declarations: [CalendarDeclarations],
      providers: [
        NotificationService,
        {
          provide: Router, useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        },
        {
          provide: ActivatedRoute, useValue: {
            params: of({id: 'mock'})
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
