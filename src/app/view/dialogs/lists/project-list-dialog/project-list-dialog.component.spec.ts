import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListDialogComponent } from './project-list-dialog.component';

describe('ProjectListDialogComponent', () => {
  let component: ProjectListDialogComponent;
  let fixture: ComponentFixture<ProjectListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
