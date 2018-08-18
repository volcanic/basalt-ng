import {Component, Input, OnInit} from '@angular/core';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {Person} from '../../../model/entities/person.model';

/**
 * Displays filter person list item
 */
@Component({
  selector: 'app-filter-person-list-item',
  templateUrl: './filter-person-list-item.component.html',
  styleUrls: ['./filter-person-list-item.component.scss']
})
export class FilterPersonListItemComponent {

  /** Person to be displayed */
  @Input() person: Person;

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
   * Handles person changes
   */
  onPersonChanged() {
    this.filterService.updatePersonsList([this.person], false);
  }
}
