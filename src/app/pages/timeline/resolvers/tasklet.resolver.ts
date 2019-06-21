import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Tasklet} from '../../../core/entity/model/tasklet.model';
import {TaskletService} from '../../../core/entity/services/tasklet/tasklet.service';

/**
 * Resolves tasklet by parameter
 */
@Injectable()
export class TaskletResolver implements Resolve<Tasklet> {

  /**
   * Constructor
   * @param router router
   * @param taskletService tasklet service
   */
  constructor(private router: Router,
              private taskletService: TaskletService) {
  }

  /**
   * Resolves parameters
   * @param route route
   * @param state state
   */
  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.taskletService.tasklets.get(route.params.id);
  }
}
