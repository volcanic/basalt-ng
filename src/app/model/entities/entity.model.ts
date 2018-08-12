import {EntityType} from './entity-type.enum';
import {UUID} from '../util/uuid';
import {Scope} from '../scope.enum';

export class Entity {
  entityType: EntityType;
  id: string;
  scope: Scope;
  creationDate: Date;
  modificationDate: Date;

  constructor() {
    this.id = new UUID().toString();
    this.scope = Scope.UNDEFINED;
    this.creationDate = new Date();
    this.modificationDate = new Date();
  }
}
