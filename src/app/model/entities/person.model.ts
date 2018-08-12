import {Entity} from './entity.model';
import {EntityType} from './entity-type.enum';

export class Person extends Entity {
  name = '';

  constructor(name: string) {
    super();
    this.entityType = EntityType.PERSON;
    this.name = name;
  }
}
