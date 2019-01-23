import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SelectableItem} from '../selectable-item';

/**
 * Represents a simple selectable item
 */
class Item implements SelectableItem {

  /** Text */
  text: string;
  /** Selected */
  selected: boolean;

  /**
   * Constructor
   */
  constructor() {
    this.text = '';
    this.selected = false;
  }
}

/**
 * Displays checkable list
 */
@Component({
  selector: 'app-completable-list',
  templateUrl: './completable-list.component.html',
  styleUrls: ['./completable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompletableListComponent implements OnInit {

  /** Items to be displayed */
  @Input() items: SelectableItem[] = [];
  /** Placeholder for new entry */
  @Input() newEntryPlaceholder = 'List entry';
  /** Whether component is readonly or not */
  @Input() readonly = false;
  /** Event emitter indicating items changes */
  @Output() itemsChangedEmitter = new EventEmitter<SelectableItem[]>();

  /** List of unselected items */
  unselectedItems: SelectableItem[] = [];
  /** List of selected items */
  selectedItems: SelectableItem[] = [];

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeItems();
  }

  //
  // Initialization
  //

  /**
   * Initializes items
   */
  private initializeItems() {
    this.items = this.items != null ? this.items.filter(item => {
      return item.text != null;
    }) : [];

    this.unselectedItems = this.items.filter(item => {
      return !item.selected;
    });
    this.selectedItems = this.items.filter(item => {
      return item.selected;
    });
  }

  //
  // Actions
  //

  /**
   * Handles item changes
   */
  onItemChanged() {
    this.initializeItems();
    this.itemsChangedEmitter.emit(this.items);
  }

  /**
   * Handles click on new-list-entry component
   */
  onNewListEntryClicked() {
    if (!this.items.some(item => {
      return item.text.trim().length === 0;
    })) {
      this.items.push(new Item());
      this.initializeItems();
    }
  }
}
