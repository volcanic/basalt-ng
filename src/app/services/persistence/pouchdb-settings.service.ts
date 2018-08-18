import {EventEmitter, Injectable, isDevMode} from '@angular/core';
import PouchDB from 'pouchdb';
import {environment} from '../../../environments/environment';

/**
 * Handles pouchdb operations for settings database
 */
@Injectable({
  providedIn: 'root'
})
export class PouchDBSettingsService {

  /** Indicates of PouchDB connection is instantiated */
  private readonly isInstantiated: boolean;
  /** Represents database */
  private database: any;
  /** Listener for database change events */
  private listener: EventEmitter<any> = new EventEmitter();

  /**
   * Constructor
   */
  public constructor() {
    if (!this.isInstantiated) {
      this.database = new PouchDB(environment.DATABASE_SETTINGS);
      this.isInstantiated = true;
    }
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
   * @param id ID of the document to be put
   * @param document document to be put
   * @returns {wdpromise.Promise<any>|Promise<any|Observable<AjaxResponse>|
   * Observable<Response>|IDBRequest>|Promise<R>|webdriver.promise.Promise<any>|webdriver.promise.Promise<R>|Promise<U>|any}
   */
  public put(id: string, document: any) {
    document._id = id;
    return this.get(id).then(result => {
      document._rev = result._rev;
      return this.database.put(document);
    }, error => {
      if (error.status === 404) {
        return this.database.put(document);
      } else {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
    });
  }

  /**
   * Remove a document by a given ID
   * @param id ID of the document to be removed
   */
  public remove(id: string) {
    return this.database.remove(id);
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
   * Synchronizes local DATABASE_ENTITIES with a remote DATABASE_SETTINGS
   * @param remote
   */
  public sync(remote: string) {
    const remoteDatabase = new PouchDB(remote);
    this.database.sync(remoteDatabase, {
      live: true
    }).on('change', change => {
      this.listener.emit(change);
    }).on('error', error => {
      console.error(JSON.stringify(error));
    });
  }

  /**
   * Synchronizes local DATABASE_ENTITIES with a remote DATABASE_SETTINGS
   * @param {string} remote
   * @param {string} username
   * @param {string} password
   */
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

  /**
   * Returns this services change listener
   * @returns {EventEmitter<any>}
   */
  public getChangeListener() {
    return this.listener;
  }
}
