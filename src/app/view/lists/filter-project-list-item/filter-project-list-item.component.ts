import {Component, Input, OnInit} from '@angular/core';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {Project} from '../../../model/entities/project.model';

@Component({
  selector: 'app-filter-project-list-item',
  templateUrl: './filter-project-list-item.component.html',
  styleUrls: ['./filter-project-list-item.component.scss']
})
export class FilterProjectListItemComponent implements OnInit {

  @Input() project: Project;

  state = 'inactive';

  constructor(private filterService: FilterService) {
  }

  ngOnInit() {
  }

  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }

  onProjectChanged() {
    this.filterService.updateProjectsList([this.project], false);
  }

}
