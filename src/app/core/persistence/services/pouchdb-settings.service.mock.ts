import {EventEmitter, Injectable, isDevMode} from '@angular/core';

/**
 * Handles pouchdb operations for settings database
 */
@Injectable({
  providedIn: 'root'
})
export class PouchDBSettingsServiceMock {

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
      this.isInstantiated = true;
    }
  }

  /**
   * Returns all documents from the DATABASE_ENTITIES
   * @returns array of documents
   */
  public fetch() {
    return new Promise((resolve) => {
      resolve();
    });
  }

  /**
   * Compacts the DATABASE_ENTITIES
   */
  public compact() {
    this.database.compact();
  }

  /**
   * Returns a document by a given ID
   * @param id id
   */
  public get(id: string) {
    return this.database.get(id);
  }

  /**
   * Inserts a document into the DATABASE_ENTITIES
   * @param id ID of the document to be put
   * @param document document to be put
   * @returns observable
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
  }

  /**
   * Synchronizes local DATABASE_ENTITIES with a remote DATABASE_SETTINGS
   * @param remote remote
   */
  public sync(remote: string) {
  }

  /**
   * Synchronizes local DATABASE_ENTITIES with a remote DATABASE_SETTINGS
   * @param remote remote
   * @param username username
   * @param password password
   */
  public syncWithUser(remote: string, username: string, password: string) {
  }

  /**
   * Returns this services change listener
   * @returns event emitter
   */
  public getChangeListener() {
    return this.listener;
  }
}
