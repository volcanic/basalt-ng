/**
 * Represents a key-value pair of a persisted setting
 */
export class Setting {

  /** Key */
  id = '';
  /** Value */
  value: any;

  /**
   * Constructor
   * @param {string} id key of the setting
   * @param {any} value value of the setting
   */
  constructor(id: string, value: any) {
    this.id = id;
    this.value = value;
  }
}
