import {Injectable} from '@angular/core';
import {Hash} from '../../model/util/hash';
import {Project} from '../../model/entities/project.model';

@Injectable()
export class ColorService {

  projectColors = [
    '#C8E6C9',
    '#A5D6A7',
    '#81C784',
    '#DCEDC8',
    '#C5E1A5',
    '#AED581',
    '#F0F4C3',
    '#E6EE9C',
    '#DCE775'
  ];

  constructor() {
  }

  getProjectColor(project: Project) {
    if (project != null && project.name != null && project.name.trim().length > 0) {
      return this.projectColors[
      Math.abs(Hash.hash(project.name.toLowerCase().replace(' ', ''))) % this.projectColors.length];
    } else {
      return 'transparent';
    }
  }
}
