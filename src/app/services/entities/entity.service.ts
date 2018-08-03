import {Injectable} from '@angular/core';
import {Entity} from '../../model/entities/entity.model';
import {ProjectService} from './project.service';
import {TaskService} from './task.service';
import {TaskletService} from './tasklet.service';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  entities = new Map<string, Entity>();

  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private taskletService: TaskletService) {
  }

  //
  // Import/Export
  //

  public downloadEntities() {
    // this.entities = new Map([...Array.from(this.projectService.projects.entries()), ...Array.from(this.taskService.tasks.entries()), ...Array.from(this.taskletService.tasklets.entries())]);

    const fileContents = JSON.stringify(Array.from(this.entities.values()));
    const filename = 'entities.basalt';
    // const filetype = 'text/plain';

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
