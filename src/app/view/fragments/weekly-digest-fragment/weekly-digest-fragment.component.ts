import {Component, Input} from '@angular/core';
import {TaskletWeeklyDigest} from '../../../model/entities/digest/tasklet-weekly-digest.model';

/**
 * Displays weekly digest fragment
 */
@Component({
  selector: 'app-weekly-digest-fragment',
  templateUrl: './weekly-digest-fragment.component.html',
  styleUrls: ['./weekly-digest-fragment.component.scss']
})
export class WeeklyDigestFragmentComponent {

  /** Tasklet weekly digest to be displayed */
  @Input() tasklet: TaskletWeeklyDigest;
}
