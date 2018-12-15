import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnusedTagsDialogComponent } from './unused-tags-dialog.component';

describe('UnusedTagsDialogComponent', () => {
  let component: UnusedTagsDialogComponent;
  let fixture: ComponentFixture<UnusedTagsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnusedTagsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnusedTagsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
