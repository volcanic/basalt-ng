import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BaseComponent} from './base.component';
import {TimelineImports} from '../../timeline.imports';
import {RouterTestingModule} from '@angular/router/testing';
import {TimelineDeclarations} from '../../timeline.declaration';

describe('BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports, RouterTestingModule],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
