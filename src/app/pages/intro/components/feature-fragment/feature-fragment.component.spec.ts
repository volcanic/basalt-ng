import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeatureFragmentComponent} from './feature-fragment.component';
import {IntroImports} from '../../intro.imports';
import {IntroDeclarations} from '../../intro.declaration';

describe('RecurrenceIntervalFragmentComponent', () => {
  let component: FeatureFragmentComponent;
  let fixture: ComponentFixture<FeatureFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IntroImports],
      declarations: [IntroDeclarations]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
