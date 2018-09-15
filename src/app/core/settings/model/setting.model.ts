/**
 * Represents a key-inputFieldValue pair of a persisted setting
 */
export class Setting {

  /** Key */
  id = '';
  /** Value */
  value = '';

  /**
   * Constructor
   * @param {string} id key of the setting
   * @param {string} value inputFieldValue of the setting
   */
  constructor(id: string, value: string) {
    this.id = id;
    this.value = value;
  }
}
