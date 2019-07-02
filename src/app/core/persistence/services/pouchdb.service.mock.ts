import {EventEmitter, Injectable, isDevMode} from '@angular/core';

/**
 * Handles pouchdb operations for entity database
 */
@Injectable({
  providedIn: 'root'
})
export class PouchDBMServiceMock {

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
   * Finds documents by a given index and options
   * @param index index used to index documents
   * @param options options to query documents by
   * @returns array of documents
   */
  public find(index: any, options): Promise<any> {
    return new Promise((result, error) => {
      result();
    });
  }

  /**
   * Returns all documents from the DATABASE_ENTITIES
   * @returns array of documents
   */
  public fetch() {
  }

  /**
   * Compacts the DATABASE_ENTITIES
   */
  public compact() {
  }

  /**
   * Returns a document by a given ID
   * @param id ID of a document to be found
   */
  public get(id: string) {
  }

  /**
   * Inserts a document into the DATABASE_ENTITIES
   * @param id ID of the document to be put
   * @param document document to be put
   * @returns observable
   */
  public put(id: string, document: any) {
  }

  /**
   * Updates a given document and creates it if it does not exist
   * @param id ID of the document to be updated or created
   * @param document document to be updated or created
   * @returns observable
   */
  public upsert(id: string, document: any) {
  }

  /**
   * Updates an array of documents
   * @param documents documents
   * @returns observable
   */
  public bulk(documents: any[]) {
  }

  /**
   * Removes a document by a given ID
   * @param id ID of the document to be removed
   * @param document document to be removed
   */
  public remove(id: string, document: any) {
  }

  /**
   * Deletes all documents from the DATABASE_ENTITIES
   */
  public clear() {
  }

  /**
   * Synchronizes local DATABASE_ENTITIES with a remote DATABASE_ENTITIES
   * @param remote remote string
   */
  public sync(remote: string) {
  }

  /**
   * Synchronizes local DATABASE_ENTITIES with a remote DATABASE_ENTITIES
   * @param remote remote string
   * @param username username used for authentication
   * @param password password used for authentication
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
