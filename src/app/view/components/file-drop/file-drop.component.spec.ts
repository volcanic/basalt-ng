/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FileDropComponent} from './file-drop.component';
import {FileUploadModule} from 'ng2-file-upload';

describe('FileDropComponent', () => {
  let component: FileDropComponent;
  let fixture: ComponentFixture<FileDropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FileDropComponent
      ],
      imports: [
        FileUploadModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
