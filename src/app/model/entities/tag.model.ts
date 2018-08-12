import {Entity} from './entity.model';
import {EntityType} from './entity-type.enum';

export class Tag extends Entity {
  name: string;
  checked = false;

  constructor(name: string, checked: boolean) {
    super();
    this.entityType = EntityType.TAG;
    this.name = name;
    this.checked = checked;
  }
}
