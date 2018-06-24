import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {Observable, Subject, Subscription, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Entity} from '../../../model/entities/entity.model';

const URL = 'https://foo.bar.com';

export const SUCCESS = 'success';
export const FAILURE = 'failure';

export interface DropResult {
  result: 'failure' | 'success';
  payload: any;
}

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styles: [require('./file-drop.component.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileDropComponent implements OnInit, OnDestroy {

  public uploader: FileUploader = new FileUploader({url: URL});
  public hasDropZoneOver = false;
  private subscription: Subscription;
  private filesSubject: Subject<File>;
  private uploadedFilesObservable: Observable<{ result: string, payload: any }>;

  @Output()
  public uploadedFiles: EventEmitter<DropResult> = new EventEmitter();

  static parseBasaltFile(value: string): Entity[] {
    return JSON.parse(value);
  }

  constructor() {
    this.filesSubject = new Subject();
    this.uploadedFilesObservable = this.filesSubject.asObservable().pipe(
      switchMap((file: File) => {
        return new Observable<any>((observer) => {
          const reader: FileReader = new FileReader();
          reader.onload = (e) => {
            observer.next((e.target as any).result);
          };
          reader.readAsBinaryString(file);
          return () => {
            reader.abort();
          };
        });
      }), map((value: string) => {
        return FileDropComponent.parseBasaltFile(value);
      }), map((results: any) => {
        return {result: SUCCESS, payload: results};
      }));
  }

  ngOnInit() {
    this.subscription = this.uploadedFilesObservable.subscribe(this.uploadedFiles);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public fileOverBase(e: any): void {
    this.hasDropZoneOver = e;
  }

  public fileDropped(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      this.filesSubject.next(files[i]);
    }
  }
}
