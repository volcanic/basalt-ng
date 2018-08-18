import {Component, Input, OnInit} from '@angular/core';
import {Tag} from '../../../model/entities/tag.model';
import {FilterService} from '../../../services/entities/filter/filter.service';

/**
 * Displays tag list item
 */
@Component({
  selector: 'app-filter-tag-list-item',
  templateUrl: './filter-tag-list-item.component.html',
  styleUrls: ['./filter-tag-list-item.component.scss']
})
export class FilterTagListItemComponent {

  /** Tag to be displayed */
  @Input() tag: Tag;

  /** Animation state */
  state = 'inactive';

  /**
   * Constructor
   * @param {FilterService} filterService
   */
  constructor(private filterService: FilterService) {
  }

  //
  // Actions
  //

  /**
   * Handles hover over container
   * @param {boolean} hovered whether there is currently a hover event
   */
  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }

  /**
   * Handles tag changes
   */
  onTagChanged() {
    this.filterService.updateTagsList([this.tag], false);
  }
}
