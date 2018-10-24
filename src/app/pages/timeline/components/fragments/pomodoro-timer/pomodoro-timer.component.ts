import {Component, Input, OnInit} from '@angular/core';
import {DateService} from '../../../../../core/entity/services/date.service';
import {MaterialColorService} from '../../../../../core/ui/services/material-color.service';
import {PaletteType} from '../../../../../core/ui/model/palette-type.enum';
import {HueType} from '../../../../../core/ui/model/hue-type.enum';

@Component({
  selector: 'app-pomodoro-timer',
  templateUrl: './pomodoro-timer.component.html',
  styleUrls: ['./pomodoro-timer.component.scss']
})
export class PomodoroTimerComponent implements OnInit {

  /** Pomodoro duration */
  @Input() pomodoroDuration: number;
  /** Pomodoro start time */
  @Input() pomodoroStartTime: Date;
  /** Text color */
  @Input() textColor: string;
  /** Background color */
  @Input() backgroundColor: string;

  /** Seconds left */
  pomodoroSecondsLeft: number;
  /** String representing left-over time */
  pomodoroTimeLeft = DateService.getMinutesString(0);

  /**
   * Constructor
   * @param materialColorService material color service
   */
  constructor(private materialColorService: MaterialColorService) {
  }

  //
  // Lifecycle hooks
  //

  ngOnInit() {
    // Initially calculate time left
    this.calculateTimeLeft();

    // Check if time is active
    if (this.isTimerActive()) {
      const refreshIntervalID = setInterval(() => {
        if (this.isTimerActive()) {
          this.calculateTimeLeft();
        } else {
          // Stop timer if time is over
          clearInterval(refreshIntervalID);
          this.invalidateTimer();
        }
      }, 1000);
    } else {
      this.invalidateTimer();
    }
  }

  //
  // Helpers
  //

  /**
   * Deactivates timer
   */
  private invalidateTimer() {
    this.pomodoroTimeLeft = DateService.getMinutesString(0);
    this.textColor = this.materialColorService.contrast(PaletteType.GREY, HueType._200);
    this.backgroundColor = this.materialColorService.color(PaletteType.GREY, HueType._200);
  }

  /**
   * Calculates the amount of seconds left on this timer
   */
  private calculateTimeLeft() {
    const desiredDurationInSeconds = this.pomodoroDuration * 60;
    const actualDurationInSeconds = DateService.diffInSeconds(new Date(), this.pomodoroStartTime);

    this.pomodoroSecondsLeft = desiredDurationInSeconds - actualDurationInSeconds;
    this.pomodoroTimeLeft = `${DateService.getMinutesString(this.pomodoroSecondsLeft)}`;
  }

  /**
   * Determines whether the time is active
   */
  private isTimerActive(): boolean {
    return this.pomodoroSecondsLeft === undefined || this.pomodoroSecondsLeft > 0;
  }
}
