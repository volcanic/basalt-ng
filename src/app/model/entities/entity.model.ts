import {EntityType} from './entity-type.enum';
import {UUID} from '../util/uuid';

export class Entity {
  entityType: EntityType;
  id: string;
  creationDate: Date;

  constructor() {
    this.id = new UUID().toString();
    this.creationDate = new Date();
  }
}
