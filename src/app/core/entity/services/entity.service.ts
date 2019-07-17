import {Injectable} from '@angular/core';
import {Entity} from '../model/entity.model';
import {ProjectService} from './project/project.service';
import {TaskService} from './task/task.service';
import {TaskletService} from './tasklet/tasklet.service';
import {TagService} from './tag/tag.service';
import {PersonService} from './person/person.service';
import {Tasklet} from '../model/tasklet.model';
import {Task} from '../model/task.model';
import {Project} from '../model/project.model';
import {Tag} from '../model/tag.model';
import {Person} from '../model/person.model';

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
   * @param taskletsMap tasklets map
   * @param tasksMap tasks map
   * @param projectsMap projects map
   * @param personsMap persons map
   * @param tagsMap tags map
   */
  public downloadEntities(taskletsMap: Map<string, Tasklet>,
                          tasksMap: Map<string, Task>,
                          projectsMap: Map<string, Project>,
                          personsMap: Map<string, Person>,
                          tagsMap: Map<string, Tag>
  ) {
    const entities =
      (Array.from(taskletsMap.values()) as Entity[]).concat(
        (Array.from(tasksMap.values()) as Entity[]).concat(
          (Array.from(projectsMap.values()) as Entity[]).concat(
            (Array.from(personsMap.values()) as Entity[]).concat(
              Array.from(tagsMap.values())))));

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
