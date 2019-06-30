import {Injectable} from '@angular/core';
import {Entity} from '../model/entity.model';
import {ProjectService} from './project.service';
import {TaskService} from './task/task.service';
import {TaskletService} from './tasklet/tasklet.service';
import {TagService} from './tag.service';
import {PersonService} from './person.service';

/**
 * Handles entities
 */
@Injectable({
  providedIn: 'root'
})
export class EntityService {

  /**
   * Constructor
   * @param projectService project service
   * @param taskService task service
   * @param taskletService tasklet service
   * @param tagService tag service
   * @param personService person service
   */
  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private taskletService: TaskletService,
              private tagService: TagService,
              private personService: PersonService) {
  }

  //
  // Import/Export
  //

  /**
   * Downloads a file containing a JSON formatted array of all entities
   */
  public downloadEntities() {
    const entities =
      (Array.from(this.projectService.projects.values()) as Entity[]).concat(
        (Array.from(this.taskService.tasks.values()) as Entity[]).concat(
          (Array.from(this.taskletService.tasklets.values()) as Entity[]).concat(
            (Array.from(this.tagService.tags.values()) as Entity[]).concat(
              Array.from(this.personService.persons.values())))));

    const fileContents = JSON.stringify(Array.from(entities.values()));
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
