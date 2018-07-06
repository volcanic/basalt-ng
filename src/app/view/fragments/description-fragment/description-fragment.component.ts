import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Description} from '../../../model/description.model';

@Component({
  selector: 'app-description-fragment',
  templateUrl: './description-fragment.component.html',
  styleUrls: ['./description-fragment.component.scss']
})
export class DescriptionFragmentComponent implements OnInit {

  @Input() description: Description = new Description();
  @Output() onDescriptionChangedEmitter = new EventEmitter<Description>();

  constructor() {
  }

  ngOnInit() {
  }

  onDeleteButtonClicked() {
    this.description.value = '';
  }

  onDescriptionChanged(value: string) {
    this.onDescriptionChangedEmitter.next(this.description);
  }
}
