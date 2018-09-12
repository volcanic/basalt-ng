import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Description} from '../../../model/entities/fragments/description.model';

/**
 * Displays previous description fragment
 */
@Component({
  selector: 'app-previous-description-fragment',
  templateUrl: './previous-description-fragment.component.html',
  styleUrls: ['./previous-description-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviousDescriptionFragmentComponent {

  /** Description to be displayed */
  @Input() previousDescription: Description = new Description();
}
