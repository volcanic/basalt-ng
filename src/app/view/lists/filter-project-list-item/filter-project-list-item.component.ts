import {Component, Input, OnInit} from '@angular/core';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {Project} from '../../../model/entities/project.model';

/**
 * Displays project list item
 */
@Component({
  selector: 'app-filter-project-list-item',
  templateUrl: './filter-project-list-item.component.html',
  styleUrls: ['./filter-project-list-item.component.scss']
})
export class FilterProjectListItemComponent {

  /** Project to be displayed */
  @Input() project: Project;

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
   * Handles tag project
   */
  onProjectChanged() {
    this.filterService.updateProjectsList([this.project], false);
  }

}
