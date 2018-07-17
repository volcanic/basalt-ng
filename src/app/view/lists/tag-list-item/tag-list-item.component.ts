import {Component, Input, OnInit} from '@angular/core';
import {Tag} from '../../../model/tag.model';
import {FilterService} from '../../../services/filter.service';

@Component({
  selector: 'app-tag-list-item',
  templateUrl: './tag-list-item.component.html',
  styleUrls: ['./tag-list-item.component.scss']
})
export class TagListItemComponent implements OnInit {

  @Input() tag: Tag;

  state = 'inactive';

  constructor(private filterService: FilterService) {
  }

  ngOnInit() {
  }

  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }

  onTagChanged() {
    this.filterService.updateTagsList([this.tag], false);
  }
}
