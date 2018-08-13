import {Component, Input, OnInit} from '@angular/core';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {Person} from '../../../model/entities/person.model';

@Component({
  selector: 'app-filter-person-list-item',
  templateUrl: './filter-person-list-item.component.html',
  styleUrls: ['./filter-person-list-item.component.scss']
})
export class FilterPersonListItemComponent implements OnInit {

  @Input() person: Person;

  state = 'inactive';

  constructor(private filterService: FilterService) {
  }

  ngOnInit() {
  }

  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }

  onPersonChanged() {
    this.filterService.updatePersonsList([this.person], false);
  }

}
