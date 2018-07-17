import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagListItemComponent } from './tag-list-item.component';

describe('TagListItemComponent', () => {
  let component: TagListItemComponent;
  let fixture: ComponentFixture<TagListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
