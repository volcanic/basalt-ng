import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styles: [require('./toolbar.component.scss')]
})
export class ToolbarComponent implements OnInit {
  @Input() title;

  constructor() { }

  ngOnInit() {
  }

}
