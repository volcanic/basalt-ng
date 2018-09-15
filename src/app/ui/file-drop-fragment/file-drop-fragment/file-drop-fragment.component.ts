import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {Observable, Subject, Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Entity} from '../../../core/entity/model/entity.model';

/** URL used by file uploader */
const URL = 'https://foo.bar.com';
/** String indicating success */
export const SUCCESS = 'success';
/** String indicating failure */
export const FAILURE = 'failure';

/**
 * Drop result interface
 */
export interface DropResult {
  /** Result state */
  result: 'failure' | 'success';
  /** Payload of dropped file */
  payload: any;
}

/**
 * Displays file drop zone
 */
@Component({
  selector: 'app-file-drop-fragment',
  templateUrl: './file-drop-fragment.component.html',
  styleUrls: ['./file-drop-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileDropFragmentComponent implements OnInit, OnDestroy {

  /** File uploader */
  public uploader: FileUploader = new FileUploader({url: URL});
  /** ? */
  public hasDropZoneOver = false;
  /** Subscription */
  private subscription: Subscription;
  /** Subject firing if a file has been dropped */
  private filesSubject: Subject<File>;
  /** Files subject turned into an observable */
  private uploadedFilesObservable: Observable<{ result: string, payload: any }>;

  /** Event emitter indicating that something has been dropped into drop zone */
  @Output() public uploadedFilesEmitter: EventEmitter<DropResult> = new EventEmitter();

  /**
   * Parses content of basalt file
   * @param {string} value JSON formatted basalt file
   * @returns {Entity[]} array of entities
   */
  static parseBasaltFile(value: string): Entity[] {
    return JSON.parse(value);
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeFilesSubject();
    this.initializeUploadedFilesObservable();
  }

  /**
   * Handles on-destroy lifecycle hook
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  //
  // Initialization
  //

  /**
   * Initializes files subject
   */
  private initializeFilesSubject() {
    this.filesSubject = new Subject();
  }

  /**
   * Initializes uploaded files observable
   */
  private initializeUploadedFilesObservable() {
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
        return FileDropFragmentComponent.parseBasaltFile(value);
      }), map((results: any) => {
        return {result: SUCCESS, payload: results};
      }));

    this.subscription = this.uploadedFilesObservable.subscribe(this.uploadedFilesEmitter);
  }

  //
  // Helpers
  //

  /**
   * Detects if a file is placed over dropzone
   * @param e event
   */
  public fileOverBase(e: any): void {
    this.hasDropZoneOver = e;
  }

  /**
   * Detects if a file has been dropped
   * @param {FileList} files array of files that have been dropped
   */
  public fileDropped(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      this.filesSubject.next(files[i]);
    }
  }
}
