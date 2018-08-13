import {Entity} from './entity.model';
import {EntityType} from './entity-type.enum';

export class Person extends Entity {

  name = '';
  email = '';
  phone = '';
  department = '';

  checked: boolean;

  constructor(name: string, checked: boolean) {
    super();
    this.entityType = EntityType.PERSON;
    this.name = name;


    this.checked = checked;
  }
}
