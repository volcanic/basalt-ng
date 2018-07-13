import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagFilterDialogComponent } from './tag-filter-dialog.component';

xdescribe('TagFilterDialogComponent', () => {
  let component: TagFilterDialogComponent;
  const fixture: ComponentFixture<TagFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
