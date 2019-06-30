import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

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
  @Input() previousDescriptionText = '';
}
