import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tag} from '../../../model/tag.model';

@Component({
  selector: 'app-todos-side-menu-start',
  templateUrl: './todos-side-menu-start.component.html',
  styleUrls: ['./todos-side-menu-start.component.scss']
})
export class TodosSideMenuStartComponent implements OnInit {
  @Input() tags = new Map<string, Tag>();
  @Input() priorities = [];
  @Output() onTagChangedEmitter = new EventEmitter<string>();
  @Output() onPrioritySelectedEmitter = new EventEmitter<string>();

  tagList = [];

  constructor() {
  }

  ngOnInit() {
    this.tagList = Array.from(this.tags.values());
  }

  onTagChanged() {
    this.onTagChangedEmitter.next();
  }

  onPrioritySelect(priority: string) {
    this.onPrioritySelectedEmitter.next(priority);
  }
}
