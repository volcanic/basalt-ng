import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Description} from '../../../model/description.model';

@Component({
  selector: 'app-previous-description-fragment',
  templateUrl: './previous-description-fragment.component.html',
  styleUrls: ['./previous-description-fragment.component.scss']
})
export class PreviousDescriptionFragmentComponent implements OnInit {
  @Input() previousDescription: Description = new Description();

  constructor() {
  }

  ngOnInit() {
  }

}
