import {Entity} from './entity.model';
import {EntityType} from './entity-type.enum';

/**
 * Represents a person
 */
export class Person extends Entity {

  /** Name */
  name = '';
  /** E-Mail address */
  email = '';
  /** Phone number */
  phone = '';
  /** Department */
  department = '';

  /**
   * Constructor
   * @param name person name
   */
  constructor(name: string) {
    super();
    this.entityType = EntityType.PERSON;
    this.name = name.trim();
  }
}
