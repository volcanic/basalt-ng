import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ColorService} from '../../../../../../core/ui/services/color.service';
import {MaterialColorService} from '../../../../../../core/ui/services/material-color.service';
import {DailyScrumItem} from '../../../../../../core/entity/model/daily-scrum/daily-scrum-item.model';
import {DailyScrumItemType} from '../../../../../../core/entity/model/daily-scrum/daily-scrum-item-type.enum';

/**
 * Displays daily scrum item fragment
 */
@Component({
  selector: 'app-daily-scrum-item-fragment',
  templateUrl: './daily-scrum-item-fragment.component.html',
  styleUrls: ['./daily-scrum-item-fragment.component.scss']
})
export class DailyScrumItemFragmentComponent implements OnInit {

  /** daily scrum item */
  @Input() dailyScrumItem: DailyScrumItem;
  /** Additional person option representing the user */
  @Input() myselfOption: string;

  /** Color of done button */
  @Input() colorDone = 'transparent';
  /** Color of doing button */
  @Input() colorDoing = 'transparent';
  /** Color of will do button */
  @Input() colorWillDo = 'transparent';
  /** Color of impediment button */
  @Input() colorImpediment = 'transparent';
  /** Color of statement */
  @Input() colorStatement = 'transparent';
  /** Contrast color of done button */
  @Input() contrastDone = 'transparent';
  /** Contrast color of doing button */
  @Input() contrastDoing = 'transparent';
  /** Contrast color of will do button */
  @Input() contrastWillDo = 'transparent';
  /** Contrast color of impediment button */
  @Input() contrastImpediment = 'transparent';
  /** Contrast color of statement */
  @Input() contrastStatement = 'transparent';

  /** Event emitter indicating changes in daily scrum item type */
  @Output() DailyScrumItemTypeSelectedEmitter = new EventEmitter<string>();
  /** Event emitter indicating changes in daily scrum item */
  @Output() dailyScrumItemChangedEmitter = new EventEmitter<DailyScrumItem>();
  /** Event emitter indicating deletion of daily scrum item */
  @Output() dailyScrumItemDeletedEmitter = new EventEmitter<DailyScrumItem>();

  /** Person background color */
  personColor: string;
  /** Person text color */
  personTextColor: string;
  /** Action background color */
  actionColor: string;
  /** Action text color */
  actionTextColor: string;
  /** Alignment */
  alignment: 'left' | 'right' = 'left';

  /** Type icon */
  typeIcon = '';
  /** Type tooltip */
  typeTooltip = '';

  /** Enum for daily scrum item types */
  dailyScrumItemType = DailyScrumItemType;

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
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeColors();
    this.initializeType();
    this.initializeAlignment();
  }

  //
  // Initialization
  //

  /**
   * Initializes indicator colors
   */
  private initializeColors() {
    if (this.dailyScrumItem.person != null) {
      this.personColor = this.colorService.getPersonColor(this.dailyScrumItem.person);
      this.personTextColor = this.colorService.getPersonContrast(this.dailyScrumItem.person);
    }

    if (this.dailyScrumItem.type != null) {
      switch (this.dailyScrumItem.type) {
        case DailyScrumItemType.DONE: {
          this.actionColor = this.colorDone;
          this.actionTextColor = this.contrastDone;
          break;
        }
        case DailyScrumItemType.DOING: {
          this.actionColor = this.colorDoing;
          this.actionTextColor = this.contrastDoing;
          break;
        }
        case DailyScrumItemType.WILL_DO: {
          this.actionColor = this.colorWillDo;
          this.actionTextColor = this.contrastWillDo;
          break;
        }
        case DailyScrumItemType.IMPEDIMENT: {
          this.actionColor = this.colorImpediment;
          this.actionTextColor = this.contrastImpediment;
          break;
        }
      }
    }
  }

  /**
   * Initializes type
   */
  private initializeType() {
    if (this.dailyScrumItem.type != null) {
      switch (this.dailyScrumItem.type) {
        case DailyScrumItemType.DONE: {
          this.typeIcon = 'check_circle';
          this.typeTooltip = 'Done';
          break;
        }
        case DailyScrumItemType.DOING: {
          this.typeIcon = 'refresh';
          this.typeTooltip = 'Doing';
          break;
        }
        case DailyScrumItemType.WILL_DO: {
          this.typeIcon = 'today';
          this.typeTooltip = 'Will Do';
          break;
        }
        case DailyScrumItemType.IMPEDIMENT: {
          this.typeIcon = 'warning';
          this.typeTooltip = 'Impediment';
          break;
        }
      }
    }
  }

  /**
   * Initializes alignment
   */
  private initializeAlignment() {
    // this.alignment = this.dailyScrumItem.person != null ? 'right' : 'left';
    this.alignment = 'left';
  }

  //
  // Actions
  //

  /**
   * Handles change of a daily scrum item statement
   * @param statement statement
   */
  ondailyScrumItemStatementChanged(statement: string) {
    this.dailyScrumItem.statement = statement;
    this.dailyScrumItemChangedEmitter.emit(this.dailyScrumItem);
  }

  /**
   * Handles deletion of a daily scrum item
   * @param dailyScrumItem daily scrum item
   */
  onDailyScrumItemDeleted(dailyScrumItem: DailyScrumItem) {
    this.dailyScrumItemDeletedEmitter.emit(dailyScrumItem);
  }
}
