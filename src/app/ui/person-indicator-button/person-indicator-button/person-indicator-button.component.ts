import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

/**
 * Displays round indicator containing a person's initials
 */
@Component({
  selector: 'app-person-indicator-button',
  templateUrl: './person-indicator-button.component.html',
  styleUrls: ['./person-indicator-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonIndicatorButtonComponent implements OnInit, OnChanges {

  /** Name of a person */
  @Input() name = '';
  /** Background personColor */
  @Input() color: string;
  /** Text personColor */
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

  /**
   * Handles on-change lifecycle phase
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges): void {
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
