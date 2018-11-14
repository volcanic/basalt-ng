import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MaterialColorService} from '../../../../../../core/ui/services/material-color.service';
import {PaletteType} from '../../../../../../core/ui/model/palette-type.enum';
import {HueType} from '../../../../../../core/ui/model/hue-type.enum';

/**
 * Displays a pomodoro timer
 */
@Component({
  selector: 'app-pomodoro-timer',
  templateUrl: './pomodoro-timer.component.html',
  styleUrls: ['./pomodoro-timer.component.scss']
})
export class PomodoroTimerComponent {

  /** Pomodoro duration */
  @Input() pomodoroDuration: number;
  /** Pomodoro start time */
  @Input() pomodoroStartTime: Date;
  /** Text color */
  @Input() textColor: string;
  /** Background color */
  @Input() backgroundColor: string;
  /** Event emitter indicating timer to be over */
  @Output() timerOverEmitter = new EventEmitter<any>();

  /**
   * Constructor
   * @param materialColorService material color service
   */
  constructor(private materialColorService: MaterialColorService) {
  }

  //
  // Actions
  //

  /**
   * Handles time-left event
   * @param timeLeft time left in seconds
   */
  onTimeLeft(timeLeft: number) {
    if (timeLeft <= 0) {
      this.textColor = this.materialColorService.contrast(PaletteType.GREY, HueType._200);
      this.backgroundColor = this.materialColorService.color(PaletteType.GREY, HueType._200);
      this.timerOverEmitter.emit();
    }
  }
}
