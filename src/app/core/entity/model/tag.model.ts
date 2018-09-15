import {Entity} from './entity.model';
import {EntityType} from './entity-type.enum';

/**
 * Represents a tag which can be used to label other entities
 */
export class Tag extends Entity {

  /** Name */
  name: string;
  /** Whether tags is checked in filter mechanism */
  checked = false;

  /**
   * Constructor
   * @param {string} name tag name
   * @param {boolean} checked whether tags is checked in filter mechanism
   */
  constructor(name: string, checked: boolean = false) {
    super();
    this.entityType = EntityType.TAG;
    this.name = name.trim();
    this.checked = checked;
  }
}
