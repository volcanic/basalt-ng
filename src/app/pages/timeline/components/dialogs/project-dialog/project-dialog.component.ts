import {Component, Inject, OnInit} from '@angular/core';
import {Project} from 'app/core/entity/model/project.model';
import {DialogMode} from 'app/core/entity/model/dialog-mode.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Action} from 'app/core/entity/model/action.enum';
import {ColorService} from '../../../../../core/ui/services/color.service';
import {MaterialColorService} from '../../../../../core/ui/services/material-color.service';
import {HueType} from '../../../../../core/ui/model/hue-type.enum';

/**
 * Displays project dialog
 */
@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {

  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Current media */
  public mode: DialogMode = DialogMode.NONE;

  /** Dialog title */
  dialogTitle = '';

  /** Project to be displayed */
  project: Project;
  /** Array of all projects */
  projects: Project[];
  /** Project color options */
  colorOptions = [];
  /** Project contrast options */
  contrastOptions = [];
  /** Disabled colors */
  colorsDisabled = [];

  /** Readonly dialog if true */
  readonly = false;

  /**
   * Constructor
   * @param colorService color service
   * @param dialogRef dialog reference
   * @param data dialog data
   * @param materialColorService material color service
   */
  constructor(private colorService: ColorService,
              public dialogRef: MatDialogRef<ProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private materialColorService: MaterialColorService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeData();
    this.initializeColorOptions();
  }

  //
  // Initialization
  //

  /**
   * Initializes data
   */
  private initializeData() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.project = this.data.project;
    this.projects = this.data.projects;
  }

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
   * Handles key down event
   * @param event event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      switch (this.mode) {
        case DialogMode.ADD: {
          this.addProject();
          break;
        }
        case DialogMode.UPDATE: {
          this.updateProject();
          break;
        }
      }
    }
  }

  /**
   * Handles color selection
   * @param color color
   */
  onColorSelected(color: string) {
    this.project.color = color;
  }

  /**
   * Handles contrast selection
   * @param contrast contrast
   */
  onContrastSelected(contrast: string) {
    this.project.contrast = contrast;
  }

  //
  // Button actions
  //

  /**
   * Handles click on add button
   */
  addProject() {
    this.dialogRef.close({action: Action.ADD, project: this.project});
  }

  /**
   * Handles click on update button
   */
  updateProject() {
    this.dialogRef.close({action: Action.UPDATE, project: this.project});
  }

  /**
   * Handles click on delete button
   */
  deleteProject() {
    this.dialogRef.close({action: Action.DELETE, project: this.project});
  }
}
