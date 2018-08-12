import {Component, Input, OnInit} from '@angular/core';
import {Tag} from '../../../model/entities/tag.model';
import {FilterService} from '../../../services/entities/filter/filter.service';

@Component({
  selector: 'app-filter-tag-list-item',
  templateUrl: './filter-tag-list-item.component.html',
  styleUrls: ['./filter-tag-list-item.component.scss']
})
export class FilterTagListItemComponent implements OnInit {

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
