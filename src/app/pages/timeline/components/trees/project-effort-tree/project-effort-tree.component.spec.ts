import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectEffortTreeComponent} from './project-effort-tree.component';
import {TimelineImports} from '../../../timeline.imports';
import {TimelineDeclarations} from '../../../timeline.declaration';

describe('ProjectEffortTreeComponent', () => {
  let component: ProjectEffortTreeComponent;
  let fixture: ComponentFixture<ProjectEffortTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEffortTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
