import {Component, Input, OnInit} from '@angular/core';
import {Tag} from '../../../../model/tag.model';

@Component({
  selector: 'app-select-tag-fragment',
  templateUrl: './select-tag-fragment.component.html',
  styleUrls: ['./select-tag-fragment.component.scss']
})
export class SelectTagFragmentComponent implements OnInit {

  @Input() tags: Tag[] = [];
  @Input() newTags: Tag[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  tagChanged() {
    let noEmptyTag = true;

    this.newTags.forEach((t: Tag) => {
        if (t.name.trim().length === 0) {
          noEmptyTag = false;
          t.checked = false;
        } else {
          t.checked = true;
        }
      }
    );

    if (noEmptyTag) {
      this.newTags.push(new Tag('', false));
    }
  }

}

