import {TaskletType} from '../../tasklet-type.enum';
import {Tasklet} from '../tasklet.model';

/**
 * Represents a weekly digest which is a special kind of tasklet
 */
export class TaskletWeeklyDigest extends Tasklet {

  /** Tasklet type */
  type = TaskletType.WEEKLY_DIGEST;
  /** Focus date whose enclosing week shall be digest displayed for */
  focusDate: Date;
}
