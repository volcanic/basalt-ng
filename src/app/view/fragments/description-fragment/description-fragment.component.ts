import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Description} from '../../../model/entities/fragments/description.model';

@Component({
  selector: 'app-description-fragment',
  templateUrl: './description-fragment.component.html',
  styleUrls: ['./description-fragment.component.scss']
})
export class DescriptionFragmentComponent implements OnInit {

  @Input() description: Description = new Description();
  @Input() disabled = false;
  @Output() descriptionChangedEmitter = new EventEmitter<Description>();

  constructor() {
  }

  ngOnInit() {
  }

  onClearButtonClicked() {
    this.description.value = '';
  }

  onDescriptionChanged(value: string) {
    this.descriptionChangedEmitter.emit(this.description);
  }
}
