import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Project} from '../../../../../core/entity/model/project.model';
import {HueType} from '../../../../../core/ui/model/hue-type.enum';
import {ColorService} from '../../../../../core/ui/services/color.service';
import {MaterialColorService} from '../../../../../core/ui/services/material-color.service';
import {Action} from '../../../../../core/entity/model/action.enum';

/**
 * Displays color popover
 */
@Component({
  selector: 'app-color-popover',
  templateUrl: './color-popover.component.html',
  styleUrls: ['./color-popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPopoverComponent implements OnChanges {

  /** Project to be displayed */
  @Input() project: Project;
  /** Array of all projects */
  @Input() projects: Project[];
  /** Event emitter indicating project to be updated */
  @Output() projectEventEmitter = new EventEmitter<{ action: Action, project: Project, projects?: Project[] }>();

  /** Project color options */
  colorOptions = [];
  /** Project contrast options */
  contrastOptions = [];
  /** Disabled colors */
  colorsDisabled = [];

  /**
   * Constructor
   * @param colorService color service
   * @param materialColorService material color service
   */
  constructor(private colorService: ColorService,
              private materialColorService: MaterialColorService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-changes lifecycle phase
   */
  ngOnChanges() {
    console.log(`ngOnChanges`);
    this.initializeColorOptions();
  }

  //
  // Initialization
  //

  /**
   * Initializes color options
   */
  private initializeColorOptions() {
    const hueOptions = this.colorService.projectOptionPalettes.map(palette => {
      return this.materialColorService.hue(palette, HueType._100);
    });

    this.colorOptions = hueOptions.map(hue => {
      return hue.color;
    });
    this.contrastOptions = hueOptions.map(hue => {
      return hue.contrast;
    });
    this.colorsDisabled = this.colorOptions.filter(color => {
      return this.project.color !== color && this.projects.some(project => {
        return project.color != null && project.color === color;
      });
    });
  }

  //
  // Actions
  //

  /**
   * Handles color selection
   * @param event event
   */
  onColorSelected(event: { color: string, contrast: string }) {
    this.project.color = event.color;
    this.project.contrast = event.contrast;
    this.projectEventEmitter.emit({action: Action.UPDATE, project: this.project});
  }
}
