import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTagFragmentComponent } from './select-tag-fragment.component';

describe('SelectTagFragmentComponent', () => {
  let component: SelectTagFragmentComponent;
  let fixture: ComponentFixture<SelectTagFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTagFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTagFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
