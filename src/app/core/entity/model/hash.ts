/* tslint:disable */
/**
 * Helper class that generates a hash value of string
 */
export class Hash {

  /**
   * Generates a hash value of a given string
   * @param value string value to hash
   * @returns hash value
   */
  static hash(value: string) {
    let hash = 0;
    if (value == null || value.length === 0) {
      return hash;
    }
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
}
