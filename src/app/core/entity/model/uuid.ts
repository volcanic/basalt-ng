/* tslint:disable */
/**
 * Helper class to create UUIDs
 */
export class UUID {

  /** String value to generate UUID for */
  private readonly value: string;

  /**
   * Constructor
   * @param input existing UUID if available
   */
  constructor(input?: string) {
    this.value = input || this.getNewUUIDString();
  }

  /**
   * Returns generated UUID string
   * @returns generated UUID string
   */
  toString() {
    return this.value;
  }

  /**
   * Creates a new UUID string
   * @returns UUID string
   */
  private getNewUUIDString(): string {
    // your favourite guid generation function could go here
    // ex: http://stackoverflow.com/a/8809472/188246
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === 'function') {
      d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
}
