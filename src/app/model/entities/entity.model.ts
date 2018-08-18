import {EntityType} from './entity-type.enum';
import {UUID} from '../util/uuid';
import {Scope} from '../scope.enum';

/**
 * Superclass of all entities
 */
export abstract class Entity {

  /** Entity type */
  entityType: EntityType;
  /** Unique identifier */
  id: string;
  /** Scope */
  scope: Scope;
  /** Creation date */
  creationDate: Date;
  /** Modification date */
  modificationDate: Date;

  /**
   * Constructor
   */
  constructor() {
    this.id = new UUID().toString();
    this.scope = Scope.UNDEFINED;
    this.creationDate = new Date();
    this.modificationDate = new Date();
  }
}
