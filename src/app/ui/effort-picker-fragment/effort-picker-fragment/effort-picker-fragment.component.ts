import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Enum containing time units
 */
enum Unit {
  MINUTE = 'mins',
  HOUR = 'hours',
  DAY = 'days',
  // WEEK = 'weeks'
}

/**
 * Enum containing planning poker values
 */
enum PlanningPokerValue {
  _0 = '0',
  _30MIN = '1/2',
  _1HOUR = '1',
  _2HOUR = '2',
  _3HOUR = '3',
  _5HOUR = '5',
  _8HOUR = '8',
  _13HOUR = '13'
}

/**
 * Displays effort picker
 */
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

  /** List of units */
  units = Object.values(Unit);
  /** List of planning poker values */
  planningPokerValues = Object.values(PlanningPokerValue);

  //
  // Helpers
  //

  /**
   * Returns the factor between a given unit and minutes
   * @param unit unit
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
   * @param unit unit
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
   * @param unit selected unit
   */
  onUnitSelected(unit: Unit) {
    this.initEffortInUnit(unit);
  }

  /**
   * Handles click on planning poker value
   * @param value value clicked on
   */
  onPlanningPokerValueClicked(value: PlanningPokerValue) {
    switch (value) {
      case PlanningPokerValue._0: {
        this.unit = Unit.MINUTE;
        this.effortInMinutes = 0;
        break;
      }
      case PlanningPokerValue._30MIN: {
        this.unit = Unit.MINUTE;
        this.effortInMinutes = 30;
        break;
      }
      case PlanningPokerValue._1HOUR: {
        this.unit = Unit.HOUR;
        this.effortInMinutes = 60;
        break;
      }
      case PlanningPokerValue._2HOUR: {
        this.unit = Unit.HOUR;
        this.effortInMinutes = 120;
        break;
      }
      case PlanningPokerValue._3HOUR: {
        this.unit = Unit.HOUR;
        this.effortInMinutes = 180;
        break;
      }
      case PlanningPokerValue._5HOUR: {
        this.unit = Unit.HOUR;
        this.effortInMinutes = 300;
        break;
      }
      case PlanningPokerValue._8HOUR: {
        this.unit = Unit.HOUR;
        this.effortInMinutes = 480;
        break;
      }
      case PlanningPokerValue._13HOUR: {
        this.unit = Unit.HOUR;
        this.effortInMinutes = 780;
        break;
      }
    }

    this.initEffortInUnit(this.unit);
    this.onEffortChanged(this.effort);
  }
}
