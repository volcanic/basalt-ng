import {EntityType} from './entity-type.enum';
import {UUID} from '../util/uuid';

export class Entity {
  entityType: EntityType;
  id: string;

  constructor() {
    this.id = new UUID().toString();
  }
}
