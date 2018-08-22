import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';

/**
 * Represents a project
 */
export class Project extends Entity {

  /** Name */
  name: string;
  /** Whether project is checked in filter mechanism */
  checked: boolean;

  /**
   * Constructor
   * @param {string} name project name
   * @param {boolean} checked whether project is checked in filter mechanism
   */
  constructor(name: string, checked: boolean = false) {
    super();
    this.entityType = EntityType.PROJECT;
    this.name = name;
    this.checked = checked;
  }
}
