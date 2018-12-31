import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletableListItemComponent } from './completable-list-item.component';

describe('CompletableListItemComponent', () => {
  let component: CompletableListItemComponent;
  let fixture: ComponentFixture<CompletableListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletableListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletableListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
