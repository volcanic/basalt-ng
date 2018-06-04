import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEffortTreeComponent } from './weekly-effort-tree.component';

describe('ProjectEffortTreeComponent', () => {
  let component: ProjectEffortTreeComponent;
  let fixture: ComponentFixture<ProjectEffortTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectEffortTreeComponent ]
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
