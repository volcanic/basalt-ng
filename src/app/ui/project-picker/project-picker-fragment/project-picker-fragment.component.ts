import {Component, Input, OnInit} from '@angular/core';

/**
 * Displays project picker
 */
@Component({
  selector: 'app-project-picker-fragment',
  templateUrl: './project-picker-fragment.component.html',
  styleUrls: ['./project-picker-fragment.component.scss']
})
export class ProjectPickerFragmentComponent implements OnInit {

  /** Project name to be displayed */
  @Input() projectName: string;

  constructor() { }

  ngOnInit() {
  }

}
