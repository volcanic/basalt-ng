import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletableListComponent } from './completable-list.component';

describe('CompletableListComponent', () => {
  let component: CompletableListComponent;
  let fixture: ComponentFixture<CompletableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
