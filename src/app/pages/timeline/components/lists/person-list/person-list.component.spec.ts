import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PersonListComponent} from './person-list.component';
import {TimelineImports} from '../../../timeline.imports';
import {TimelineDeclarations} from '../../../timeline.declaration';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('PersonListComponent', () => {
  let component: PersonListComponent;
  let fixture: ComponentFixture<PersonListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports, BrowserAnimationsModule],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
