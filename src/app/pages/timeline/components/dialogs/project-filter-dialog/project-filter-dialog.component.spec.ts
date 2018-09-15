import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectFilterDialogComponent} from './project-filter-dialog.component';

xdescribe('ProjectFilterDialogComponent', () => {
  let component: ProjectFilterDialogComponent;
  let fixture: ComponentFixture<ProjectFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectFilterDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
