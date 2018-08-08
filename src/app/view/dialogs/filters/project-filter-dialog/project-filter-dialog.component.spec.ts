import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectsFilterDialogComponent} from './project-filter-dialog.component';

xdescribe('ProjectsFilterDialogComponent', () => {
  let component: ProjectsFilterDialogComponent;
  let fixture: ComponentFixture<ProjectsFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsFilterDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
