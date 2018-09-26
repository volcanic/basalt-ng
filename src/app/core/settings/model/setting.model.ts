/**
 * Represents a key-value pair of a persisted setting
 */
export class Setting {

  /** Key */
  id = '';
  /** Value */
  value = '';

  /**
   * Constructor
   * @param {string} id key of the setting
   * @param {string} value value of the setting
   */
  constructor(id: string, value: string) {
    this.id = id;
    this.value = value;
  }
}
