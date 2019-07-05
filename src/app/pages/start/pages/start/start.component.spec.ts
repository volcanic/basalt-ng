import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StartComponent} from './start.component';
import {StartImports} from '../../start.imports';
import {CalendarDeclarations} from '../../start.declaration';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';

describe('StartComponent', () => {
  let component: StartComponent;
  let fixture: ComponentFixture<StartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StartImports],
      declarations: [CalendarDeclarations],
      providers: [
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
    fixture = TestBed.createComponent(StartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
