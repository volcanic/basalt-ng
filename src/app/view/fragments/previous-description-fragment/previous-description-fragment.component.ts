import {Component, Input, OnInit} from '@angular/core';
import {Description} from '../../../model/entities/fragments/description.model';

/**
 * Displays previous description fragment
 */
@Component({
  selector: 'app-previous-description-fragment',
  templateUrl: './previous-description-fragment.component.html',
  styleUrls: ['./previous-description-fragment.component.scss']
})
export class PreviousDescriptionFragmentComponent {

  /** Description to be displayed */
  @Input() previousDescription: Description = new Description();
}
