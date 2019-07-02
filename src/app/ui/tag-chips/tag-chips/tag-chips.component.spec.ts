import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TagChipsComponent} from './tag-chips.component';
import {TagChipsImports} from '../tag-chips.imports';
import {TagChipsDeclarations} from '../tag-chips.declaration';

describe('TagChipsComponent', () => {
  let component: TagChipsComponent;
  let fixture: ComponentFixture<TagChipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TagChipsImports],
      declarations: [TagChipsDeclarations]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
