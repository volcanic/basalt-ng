import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';
import {Scope} from '../scope.enum';

export class Project extends Entity {

  name: string;
  scope: Scope;
  checked: boolean;

  constructor(name: string, checked: boolean) {
    super();
    this.entityType = EntityType.PROJECT;
    this.name = name;
    this.scope = Scope.UNDEFINED;
    this.checked = checked;
  }
}
