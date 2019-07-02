import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StopWatchComponent} from './stop-watch.component';
import {StopWatchImports} from '../stop-watch.imports';
import {StopWatchDeclarations} from '../stop-watch.declaration';

describe('StopWatchComponent', () => {
  let component: StopWatchComponent;
  let fixture: ComponentFixture<StopWatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StopWatchImports],
      declarations: [StopWatchDeclarations]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
