import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Tasklet} from '../../../core/entity/model/tasklet.model';
import {TaskletService} from '../../../core/entity/services/tasklet.service';

@Injectable()
export class TaskletResolver implements Resolve<Tasklet> {

  constructor(private router: Router,
              private taskletService: TaskletService) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.taskletService.tasklets.get(route.params.id);
  }
}
