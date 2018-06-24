import {Component, Input, OnInit} from '@angular/core';
import {Tag} from '../../../../model/tag.model';
import {Tasklet} from '../../../../model/entities/tasklet.model';

@Component({
  selector: 'app-tasklet-dialog-tags',
  templateUrl: './tasklet-dialog-tags.component.html',
  styleUrls: ['./tasklet-dialog-tags.component.scss']
})
export class TaskletDialogTagsComponent implements OnInit {
  @Input() tasklet: Tasklet;
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
        }
      }
    );

    if (noEmptyTag) {
      this.newTags.push(new Tag('', false));
    }
  }

}
