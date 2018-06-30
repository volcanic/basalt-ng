import {Component, ElementRef, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Tag} from '../../../model/tag.model';

@Component({
  selector: 'app-tag-selection-fragment',
  templateUrl: './tag-selection-fragment.component.html',
  styleUrls: ['./tag-selection-fragment.component.scss']
})
export class TagSelectionFragmentComponent implements OnInit {

  @Input() tags: Tag[] = [];
  @Input() newTags: Tag[] = [];
  @ViewChildren('tagElement') tagElements: QueryList<ElementRef>;

  constructor() {
  }

  ngOnInit() {
  }

  tagChanged() {
    let hasEmptyTag = false; // holds information about whether there is an empty tag in the list of tags or not

    this.newTags.forEach((t: Tag, loopIndex: number) => {
      if (t.name.trim().length === 0) { // if the tag is empty
        hasEmptyTag = true; // set the tag
        t.checked = false; // remove the tick from the checkbox

        // If the current empty tag is at second last position, pop the last tag
        if ( loopIndex === this.newTags.length - 2 ) {
          this.newTags.pop();
        } else if ( loopIndex < this.newTags.length - 2) {
          // if the current empty tag is before second last position, splice array
          this.newTags.splice(loopIndex, 1);
          const lastTagLabel = this.tagElements.last.nativeElement.childNodes[0].childNodes[0].childNodes[1].childNodes[1];
          lastTagLabel.focus(); // Re-focus cursor to last element of the new tags // TODO: Make html-model unreliant
        } else {
          // If the current empty tag is at the end of the list, do nothing
        }
      } else {
        t.checked = true; // if the tag has content, i.e. user starts typing, tick the checkbox
      }
    });

    if (!hasEmptyTag) {
      this.newTags.push(new Tag('', false));
    }
  }

}

