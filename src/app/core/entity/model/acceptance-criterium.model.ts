import {SelectableItem} from '../../../ui/checkable-list/selectable-item';

/**
 * Represents an acceptance criterium
 */
export class AcceptanceCriterium implements SelectableItem {

  /** Text */
  text: string;
  /** Completed */
  completed: boolean;

  /**
   * Constructor
   */
  constructor() {
    this.text = '';
    this.completed = false;
  }
}
