import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

enum Unit {
  MINUTE = 'mins',
  HOUR = 'hours',
  DAY = 'days',
  // WEEK = 'weeks'
}

@Component({
  selector: 'app-effort-picker-fragment',
  templateUrl: './effort-picker-fragment.component.html',
  styleUrls: ['./effort-picker-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EffortPickerFragmentComponent implements OnInit {

  /** Effort in minutes */
  @Input() effortInMinutes = 0;
  /** Event emitter indicating changes in effort */
  @Output() effortEventEmitter = new EventEmitter<number>();

  /** Effort in selected unit */
  effort = 0;
  /** Effort in selected unit (rounded) */
  effortRounded = 0;
  /** Time unit */
  unit = Unit.MINUTE;

  /** Enum for unit types */
  unitType = Unit;
  /** List of units */
  units = Object.values(Unit);


  //
  // Helpers
  //

  /**
   * Returns the factor between a given unit and minutes
   * @param unit
   */
  private static getFactorComparedToMinute(unit: Unit): number {
    switch (unit) {
      case Unit.MINUTE: {
        return 1;
      }
      case Unit.HOUR: {
        return 60;
      }
      case Unit.DAY: {
        return 60 * 24;
      }
      /*
      case Unit.WEEK: {
        return 60 * 24 * 7;
      }
      */
    }
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initEffortInUnit(this.unit);
  }

  //
  // Initialization
  //

  /**
   * Initializes effort in unit
   */
  private initEffortInUnit(unit: Unit) {
    this.effort = this.effortInMinutes / EffortPickerFragmentComponent.getFactorComparedToMinute(unit);
    this.effortRounded = Math.round(this.effort * 100) / 100;
  }

  //
  // Actions
  //

  /**
   * Handles changes in effort
   * @param effort effort
   */
  onEffortChanged(effort: number) {
    this.effortInMinutes = effort * EffortPickerFragmentComponent.getFactorComparedToMinute(this.unit);
    this.effortEventEmitter.emit(this.effortInMinutes);
  }

  /**
   * Handles selection of a unit
   * @param unit
   */
  onUnitSelected(unit: Unit) {
    this.initEffortInUnit(unit);
  }
}
