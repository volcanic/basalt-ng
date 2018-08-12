import {EventEmitter, Injectable, isDevMode} from '@angular/core';
import {environment} from '../../../environments/environment';
import PouchDB from 'pouchdb';
import PouchdbFind from 'pouchdb-find';
import PouchdbUpsert from 'pouchdb-upsert';

@Injectable()
export class PouchDBService {

  private readonly isInstantiated: boolean;
  private database: any;
  private listener: EventEmitter<any> = new EventEmitter();

  public constructor() {
    PouchDB.plugin(PouchdbFind);
    PouchDB.plugin(PouchdbUpsert);

    if (!this.isInstantiated) {
      this.database = new PouchDB(environment.DATABASE_ENTITIES);
      this.isInstantiated = true;
    }
  }

  public find(index: any, options) {
    // console.log(`find index ${JSON.stringify(index)}`);
    // console.log(`find options ${JSON.stringify(options)}`);

    return this.database.createIndex({
      index: index
    }).then(() => {
      return this.database.find(options);
    });
  }

  /**
   * Returns all documents from the DATABASE_ENTITIES
   * @returns {any}
   */
  public fetch() {
    return this.database.allDocs({include_docs: true});
  }

  /**
   * Compacts the DATABASE_ENTITIES
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
   * Inserts a document into the DATABASE_ENTITIES
   * @param id
   * @param document
   * @returns {wdpromise.Promise<any>|Promise<any|Observable<>|
   * Observable<Response>|IDBRequest>|Promise<R>|webdriver.promise.Promise<any>|webdriver.promise.Promise<R>|Promise<U>|any}
   */
  public put(id: string, document: any) {
    document._id = id;

    return this.database.put(document);
  }

  public upsert(id: string, document: any) {
    document._id = id;

    return this.database.upsert(id, () => {
      return document;
    });
  }

  public bulk(documents: any[]) {
    documents.forEach(d => {
      d._id = d.id;
    });

    return this.database.bulkDocs(documents);
  }

  /**
   * Remove a document by a given ID
   * @param id id of the document to remove
   * @param document document to remove
   */
  public remove(id: string, document: any) {
    return this.database.remove(document._id, document._rev);
  }

  /**
   * Deletes all documents from the DATABASE_ENTITIES
   */
  public clear() {
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
   * Synchronizes local DATABASE_ENTITIES with a remote DATABASE_ENTITIES
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
