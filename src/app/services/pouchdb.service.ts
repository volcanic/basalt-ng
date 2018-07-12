import {EventEmitter, Injectable, isDevMode} from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class PouchDBService {

  private isInstantiated: boolean;
  private database: any;
  private listener: EventEmitter<any> = new EventEmitter();

  public constructor() {
    if (!this.isInstantiated) {
      this.database = new PouchDB('basalt');
      this.isInstantiated = true;
    }
  }

  /**
   * Returns all documents from the database
   * @returns {any}
   */
  public fetch() {
    console.log(`DEBUG fetch`);
    return this.database.allDocs({include_docs: true});
  }

  /**
   * Compacts the database
   */
  public compact() {
    this.database.compact();
  }

  /**
   * Returns a document by a given ID
   * @param id
   */
  public get(id: string) {
    return this.database.get(id);
  }

  /**
   * Inserts a document into the database
   * @param id
   * @param document
   * @returns {wdpromise.Promise<any>|Promise<any|Observable<AjaxResponse>|
   * Observable<Response>|IDBRequest>|Promise<R>|webdriver.promise.Promise<any>|webdriver.promise.Promise<R>|Promise<U>|any}
   */
  public put(id: string, document: any) {
    document._id = id;

    // console.log(`DEBUG put ${JSON.stringify(document)}`);
    return this.database.put(document);
  }

  public bulk(documents: any[]) {
    documents.forEach(d => {
      d._id = d.id;
    });

    return this.database.bulkDocs(documents);
  }

  /**
   * Remove a document by a given ID
   * @param id
   */
  public remove(id: string, document: any) {
    console.log(`DEBUG remove ${document._id}`);
    console.log(`DEBUG remove ${document._rev}`);
    return this.database.remove(document._id, document._rev);
  }

  /**
   * Deletes all documents from the database
   */
  public clear() {
    console.log(`DEBUG clear`);
    this.fetch().then(result => {
      result.rows.forEach(r => {
        this.database.remove(r.doc);
      });
    }, error => {
      if (isDevMode()) {
        console.error(error);
      }
    });
  }

  /**
   * Synchronizes local database with a remote database
   * @param remote
   */
  public sync(remote: string) {
    console.log(`DEBUG sync ${remote}`);
    const remoteDatabase = new PouchDB(remote);
    this.database.sync(remoteDatabase, {
      live: true
    }).on('change', change => {
      this.listener.emit(change);
    }).on('error', error => {
      console.error(JSON.stringify(error));
    });
  }

  public syncWithUser(remote: string, username: string, password: string) {
    const remoteDatabase = new PouchDB(remote);
    this.database.sync(remoteDatabase, {
      live: true,
      auth: {
        username: username,
        password: password
      },
    }).on('change', change => {
      this.listener.emit(change);
    }).on('error', error => {
      console.error(JSON.stringify(error));
    });
  }

  public getChangeListener() {
    return this.listener;
  }
}
