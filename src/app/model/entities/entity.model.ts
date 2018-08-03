import {EntityType} from './entity-type.enum';
import {UUID} from '../util/uuid';

export class Entity {
  entityType: EntityType;
  id: string;
  creationDate: Date;

  constructor() {
    this.id = new Date().toJSON() + Math.random();
    this.creationDate = new Date();
  }
}
