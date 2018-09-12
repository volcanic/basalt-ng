/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FileDropFragmentComponent} from './file-drop-fragment.component';
import {FileUploadModule} from 'ng2-file-upload';

describe('FileDropFragmentComponent', () => {
  let component: FileDropFragmentComponent;
  let fixture: ComponentFixture<FileDropFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FileDropFragmentComponent
      ],
      imports: [
        FileUploadModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDropFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
