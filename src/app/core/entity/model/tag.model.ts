import {Entity} from './entity.model';
import {EntityType} from './entity-type.enum';

/**
 * Represents a tag which can be used to label other entities
 */
export class Tag extends Entity {

  /** Name */
  name: string;

  /**
   * Constructor
   * @param {string} name tag name
   */
  constructor(name: string) {
    super();
    this.entityType = EntityType.TAG;
    this.name = name.trim();
  }
}
