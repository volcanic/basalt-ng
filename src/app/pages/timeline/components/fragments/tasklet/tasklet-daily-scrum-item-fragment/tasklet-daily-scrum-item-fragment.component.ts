import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DateService} from '../../../../../../core/entity/services/date.service';
import {DailyScrumItem} from '../../../../../../core/entity/model/daily-scrum/daily-scrum-item.model';
import {DailyScrumItemType} from '../../../../../../core/entity/model/daily-scrum/daily-scrum-item-type.enum';

/**
 * Displays daily scrum item fragment
 */
@Component({
  selector: 'app-tasklet-daily-scrum-item-fragment',
  templateUrl: './tasklet-daily-scrum-item-fragment.component.html',
  styleUrls: ['./tasklet-daily-scrum-item-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskletDailyScrumItemFragmentComponent implements OnInit {

  /** Daily Scrum item to display */
  @Input() dailyScrumItem: DailyScrumItem;

  /** Icon name */
  icon = '';
  /** List of meeting minute item statement parts */
  dailyScrumItemStatementParts: string[];
  /** Reference to static method */
  getDateString = DateService.getDateString;
  /** Reference to static method */
  getTimeString = DateService.getTimeString;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeIcon();
    this.initializeDailyScrumItemStatementParts();
  }

  //
  // Initialization
  //

  /**
   * Initializes icon
   */
  private initializeIcon() {
    if (this.dailyScrumItem != null && this.dailyScrumItem.type != null) {
      switch (this.dailyScrumItem.type) {
        case DailyScrumItemType.DONE: {
          this.icon = 'check_circle';
          break;
        }
        case DailyScrumItemType.DOING: {
          this.icon = 'today';
          break;
        }
        case DailyScrumItemType.WILL_DO: {
          this.icon = 'refresh';
          break;
        }
        case DailyScrumItemType.IMPEDIMENT: {
          this.icon = 'warning';
          break;
        }
      }
    }
  }

  /**
   * Initializes meeting minute item statement parts
   */
  private initializeDailyScrumItemStatementParts() {
    if (this.dailyScrumItem != null && this.dailyScrumItem.statement != null) {
      this.dailyScrumItemStatementParts = this.dailyScrumItem.statement.split('\n').map(p => {
        return p.trim();
      });
    }
  }
}
