import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Task} from '../../../core/entity/model/task.model';
import {TaskService} from '../../../core/entity/services/task/task.service';

/**
 * Resolves task by parameter
 */
@Injectable()
export class TaskResolver implements Resolve<Task> {

  /**
   * Constructor
   * @param router router
   * @param taskService task service
   */
  constructor(private router: Router,
              private taskService: TaskService) {
  }

  /**
   * Resolves parameters
   * @param route route
   * @param state state
   */
  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.taskService.tasks.get(route.params.id);
  }
}
