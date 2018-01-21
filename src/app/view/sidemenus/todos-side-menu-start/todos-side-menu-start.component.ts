import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-todos-side-menu-start',
  templateUrl: './todos-side-menu-start.component.html',
  styleUrls: ['./todos-side-menu-start.component.scss']
})
export class TodosSideMenuStartComponent implements OnInit {
  @Input() tags = [];
  @Output() onTagChangedEmitter = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  onTagChanged() {
    this.onTagChangedEmitter.next();
  }
}
