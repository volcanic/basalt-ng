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
  /** Whether person is checked in filter mechanism */
  checked: boolean;

  /**
   * Constructor
   * @param {string} name person name
   * @param {boolean} checked whether person is checked in filter mechanism
   */
  constructor(name: string, checked: boolean) {
    super();
    this.entityType = EntityType.PERSON;
    this.name = name;

    this.checked = checked;
  }
}
