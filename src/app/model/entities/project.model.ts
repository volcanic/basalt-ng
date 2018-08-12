import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';
import {Scope} from '../scope.enum';

export class Project extends Entity {

  name: string;
  checked: boolean;

  constructor(name: string, checked: boolean) {
    super();
    this.entityType = EntityType.PROJECT;
    this.name = name;
    this.checked = checked;
  }
}
