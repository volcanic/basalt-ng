import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TagListDialogComponent} from './tag-list-dialog.component';

describe('TagListDialogComponent', () => {
  let component: TagListDialogComponent;
  let fixture: ComponentFixture<TagListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagListDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
