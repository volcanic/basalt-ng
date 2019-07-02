import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StartComponent} from './start.component';
import {StartImports} from '../../start.imports';
import {CalendarDeclarations} from '../../start.declaration';
import {Router} from '@angular/router';

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
