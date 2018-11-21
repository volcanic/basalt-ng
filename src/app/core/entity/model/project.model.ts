import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';

/**
 * Represents a project
 */
export class Project extends Entity {

  /** Name */
  name: string;

  /**
   * Constructor
   * @param {string} name project name
   */
  constructor(name: string) {
    super();
    this.entityType = EntityType.PROJECT;
    this.name = name.trim();
  }
}
