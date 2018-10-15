import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MaterialColorService} from '../../../../../../core/ui/services/material-color.service';
import {PaletteType} from '../../../../../../core/ui/model/palette-type.enum';
import {HueType} from '../../../../../../core/ui/model/hue-type.enum';
import {Person} from '../../../../../../core/entity/model/person.model';
import {DailyScrumItem} from '../../../../../../core/entity/model/daily-scrum/daily-scrum-item.model';
import {DailyScrumItemType} from '../../../../../../core/entity/model/daily-scrum/daily-scrum-item-type.enum';
import {ColorService} from '../../../../../../core/ui/services/color.service';

/**
 * Displays daily scrum fragment
 */
@Component({
  selector: 'app-daily-scrum-fragment',
  templateUrl: './daily-scrum-fragment.component.html',
  styleUrls: ['./daily-scrum-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyScrumFragmentComponent implements OnInit {

  /** Array of daily scrum items */
  @Input() dailyScrumItems: DailyScrumItem[] = [];
  /** Array of person options */
  @Input() personOptions: string[] = [];
  /** Additional person option representing the user */
  @Input() myselfOption: string;
  /** Event emitter indicating changes in daily scrum items */
  @Output() dailyScrumItemsUpdatedEmitter = new EventEmitter<DailyScrumItem[]>();

  /** Input text */
  text = '';
  /** Current person */
  person = null;

  /** Shortcut button for done */
  private SHORTCUT_DONE = '?';
  /** Shortcut button for doing */
  private SHORTCUT_DOING = '?';
  /** Shortcut button for will do */
  private SHORTCUT_WILL_DO = '?';
  /** Shortcut button for impediment */
  private SHORTCUT_IMPEDIMENT = '?';

  /** Tooltip of done button */
  tooltipDone = `Done (CTRL+${this.SHORTCUT_DONE})`;
  /** Tooltip of doing button */
  tooltipDoing = `Doing (CTRL+${this.SHORTCUT_DOING})`;
  /** Tooltip of will do button */
  tooltipWillDo = `Will Do (CTRL+${this.SHORTCUT_WILL_DO})`;
  /** Tooltip of impediment button */
  tooltipImpediment = `Impediment (CTRL+${this.SHORTCUT_IMPEDIMENT})`;

  /** Color of done button */
  colorDone = 'transparent';
  /** Color of doing button */
  colorDoing = 'transparent';
  /** Color of will do button */
  colorWillDo = 'transparent';
  /** Color of impediment button */
  colorImpediment = 'transparent';
  /** Color of person button */
  colorPerson = 'transparent';
  /** Color of statement bubble */
  colorStatement = 'transparent';

  /** Contrast color of done button */
  contrastDone = 'transparent';
  /** Contrast color of doing button */
  contrastDoing = 'transparent';
  /** Contrast color of will do button */
  contrastWillDo = 'transparent';
  /** Contrast color of impediment button */
  contrastImpediment = 'transparent';
  /** Contrast color of person button */
  contrastPerson = 'transparent';
  /** Contrast color of statement */
  contrastStatement = 'transparent';

  /**
   * Constructor
   * @param colorService color service
   * @param materialColorService material color service
   */
  constructor(private colorService: ColorService, private materialColorService: MaterialColorService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeColors();
    this.initializedailyScrumItems();
  }

  //
  // Initialization
  //

  /**
   * Initializes colors
   */
  private initializeColors() {
    this.colorDone = this.materialColorService.color(PaletteType.GREEN, HueType._300);
    this.colorDoing = this.materialColorService.color(PaletteType.GREEN, HueType._500);
    this.colorWillDo = this.materialColorService.color(PaletteType.BLUE, HueType._500);
    this.colorImpediment = this.materialColorService.color(PaletteType.RED, HueType._200);
    this.colorPerson = this.materialColorService.color(PaletteType.GREY, HueType._500);
    this.colorStatement = this.materialColorService.color(PaletteType.GREY, HueType._200);

    this.contrastDone = this.materialColorService.contrast(PaletteType.GREEN, HueType._300);
    this.contrastDoing = this.materialColorService.contrast(PaletteType.GREEN, HueType._500);
    this.contrastWillDo = this.materialColorService.contrast(PaletteType.BLUE, HueType._500);
    this.contrastImpediment = this.materialColorService.contrast(PaletteType.RED, HueType._200);
    this.contrastPerson = this.materialColorService.contrast(PaletteType.GREY, HueType._500);
    this.contrastStatement = this.materialColorService.contrast(PaletteType.GREY, HueType._200);
  }

  /**
   * Initializes daily scrum items
   */
  private initializedailyScrumItems() {
    if (this.dailyScrumItems == null) {
      this.dailyScrumItems = [];
    }
  }

  //
  // Actions
  //

  /**
   * Handles key down event
   * @param event event
   */
  onKeyDown(event: any) {
    if (event.ctrlKey) {
      switch (String.fromCharCode(event.keyCode).toUpperCase()) {
        case this.SHORTCUT_DONE: {
          this.addDone(this.text);
          break;
        }
        case this.SHORTCUT_DOING: {
          this.addDoing(this.text);
          break;
        }
        case this.SHORTCUT_WILL_DO: {
          this.addWillDo(this.text);
          break;
        }
        case this.SHORTCUT_IMPEDIMENT: {
          this.addImpediment(this.text);
          break;
        }
      }
    }
  }

  /**
   * Handles click on done button
   */
  onDoneClicked() {
    if (this.person != null) {
      this.addDone(this.text);
    }
  }

  /**
   * Handles click on doing button
   */
  onDoingClicked() {
    if (this.person != null) {
      this.addDoing(this.text);
    }
  }

  /**
   * Handles click on will do button
   */
  onWillDoClicked() {
    if (this.person != null) {
      this.addWillDo(this.text);
    }
  }

  /**
   * Handles click on impediment button
   */
  onImpedimentClicked() {
    if (this.person != null) {
      this.addImpediment(this.text);
    }
  }

  /**
   * Handles selection of a person
   * @param name name of the selected person
   */
  onPersonSelected(name: string) {
    this.person = new Person(name, true);
    this.colorPerson = this.colorService.getPersonColor(this.person);
    this.contrastPerson = this.colorService.getPersonContrast(this.person);
  }

  /**
   * Handles changes of a daily scrum item statement
   * @param dailyScrumItem daily scrum item
   */
  onDailyScrumItemChanged(dailyScrumItem: DailyScrumItem) {
    let item = this.dailyScrumItems.find(i => {
      return i.date.toString() !== dailyScrumItem.date.toString();
    });

    if (item != null) {
      item = dailyScrumItem;
      this.dailyScrumItemsUpdatedEmitter.emit(this.dailyScrumItems);
    }
  }

  /**
   * Handles deletion of a daily scrum item
   * @param dailyScrumItem daily scrum item
   */
  onDailyScrumItemDeleted(dailyScrumItem: DailyScrumItem) {
    this.dailyScrumItems = this.dailyScrumItems.filter(item => {
      return item.date != null
        && dailyScrumItem.date != null
        && item.date.toString() !== dailyScrumItem.date.toString();
    });

    this.dailyScrumItemsUpdatedEmitter.emit(this.dailyScrumItems);
  }

  //
  // Helpers
  //

  /**
   * Adds a daily scrum item of type done
   * @param statement statement
   */
  private addDone(statement: string) {
    if (statement.trim() !== '') {
      const item = new DailyScrumItem();
      item.date = new Date();
      item.person = this.person;
      item.type = DailyScrumItemType.DONE;
      item.statement = statement;
      this.dailyScrumItems.push(item);
      this.text = '';

      this.dailyScrumItemsUpdatedEmitter.emit(this.dailyScrumItems);
    }
  }

  /**
   * Adds a daily scrum item of type doing
   * @param statement statement
   */
  private addDoing(statement: string) {
    if (statement.trim() !== '') {
      const item = new DailyScrumItem();
      item.date = new Date();
      item.person = this.person;
      item.type = DailyScrumItemType.DOING;
      item.statement = statement;
      this.dailyScrumItems.push(item);
      this.text = '';

      this.dailyScrumItemsUpdatedEmitter.emit(this.dailyScrumItems);
    }
  }

  /**
   * Adds a daily scrum item of type will do
   * @param statement statement
   */
  private addWillDo(statement: string) {
    if (statement.trim() !== '') {
      const item = new DailyScrumItem();
      item.date = new Date();
      item.person = this.person;
      item.type = DailyScrumItemType.WILL_DO;
      item.statement = statement;
      this.dailyScrumItems.push(item);
      this.text = '';

      this.dailyScrumItemsUpdatedEmitter.emit(this.dailyScrumItems);
    }
  }

  /**
   * Adds a daily scrum item of type impediment
   * @param statement statement
   */
  private addImpediment(statement: string) {
    if (statement.trim() !== '') {
      const item = new DailyScrumItem();
      item.date = new Date();
      item.person = this.person;
      item.type = DailyScrumItemType.IMPEDIMENT;
      item.statement = statement;
      this.dailyScrumItems.push(item);
      this.text = '';

      this.dailyScrumItemsUpdatedEmitter.emit(this.dailyScrumItems);
    }
  }
}
