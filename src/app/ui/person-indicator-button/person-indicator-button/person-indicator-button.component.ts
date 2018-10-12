import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Displays round indicator containing a person's initials
 */
@Component({
  selector: 'app-person-indicator-button',
  templateUrl: './person-indicator-button.component.html',
  styleUrls: ['./person-indicator-button.component.scss']
})
export class PersonIndicatorButtonComponent implements OnInit {

  /** Name of a person */
  @Input() name: string;
  /** Background color */
  @Input() color: string;
  /** Text color */
  @Input() textColor: string;
  /** Event emitter indicating click action */
  @Output() clickEmitter = new EventEmitter<any>();

  /** Initials */
  initials: string;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeInitials();
  }

  //
  // Initialization
  //

  /**
   * Initializes initials based on the name
   */
  private initializeInitials() {
    this.initials = this.name.split(' ').map(w => {
      return w[0];
    }).join('').toUpperCase();
  }


  //
  // Actions
  //

  /**
   * Handles on-click actions
   */
  onClick() {
    this.clickEmitter.emit();
  }
}
