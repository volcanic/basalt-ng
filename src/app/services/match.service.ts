import {Injectable} from '@angular/core';
import {Tasklet} from '../model/tasklet.model';

@Injectable()
export class MatchService {

  /**
   * Determines whether a tasklet matches any of the specified items
   *
   * @param tasklet value to check
   * @param items multiple words in one string
   * @returns {boolean}
   */
  public taskletMatchesAnyItem(tasklet: Tasklet, items: string): boolean {
    if (items == null || items.trim() === '') {
      return true;
    }

    return this.splitSearchItems(items).some(i => {
      return this.taskletMatchesSingleItem(tasklet, i);
    });
  }

  /**
   * Determines whether a tasklet matches every of the specified items
   *
   * @param tasklet value to check
   * @param items multiple words in one string
   * @returns {boolean}
   */
  public taskletMatchesEveryItem(tasklet: Tasklet, items: string): boolean {
    // Indicate a match if no filter mechanism is used
    if ((items == null || items.trim() === '')) {
      return true;
    }

    return this.splitSearchItems(items).every(i => {
      return this.taskletMatchesSingleItem(tasklet, i);
    });
  }

  /**
   * Determines whether any of tasklet's attributes contains a certain item
   * @param tasklet tasklet
   * @param item single word
   * @returns {boolean}
   */
  public taskletMatchesSingleItem(tasklet: Tasklet, item: string): boolean {
    // Check for each text if matches item
    if (tasklet.text != null && tasklet.text.split('\n').some(s => {
        return this.textMatchesSingleItem(s, item);
      }) || (tasklet.taskName != null && this.textMatchesSingleItem(tasklet.taskName, item))) {
      return true;
    }
  }

  public textMatchesAnyItem(text: string, items: string): boolean {
    if (items == null || items.toString().trim() === '') {
      return false;
    }

    return this.splitSearchItems(items).some(i => {
      return this.textMatchesSingleItem(text, i);
    });
  }

  public textMatchesSingleItem(text: string, item: string): boolean {
    return this.valueMatchesSingleItem(text, item);
  }


  /**
   * Determines whether a value contains a specific item
   *
   * @param value value to check
   * @param items multiple words in one string
   * @returns {boolean}
   */
  public valueMatchesAnyItem(value: string, items: string): boolean {
    if (items == null) {
      return false;
    }

    return this.splitSearchItems(items).some(t => {
      return this.valueMatchesSingleItem(value, t);
    });
  }

  /**
   * Determines whether a value contains a specific item
   *
   * @param value value to check
   * @param item single word
   * @returns {boolean}
   */
  public valueMatchesSingleItem(value: string, item: string): boolean {
    if (value == null || item == null || item.trim() === '') {
      return false;
    }

    return this.normalize(value).includes(this.normalize(item.toString()));
  }

  /**
   * Normalizes a string in order to make comparison less prone to errors
   * @param value
   */
  public normalize(value: string): string {
    return (value != null) ? value
      .toString()
      .trim()
      .toLowerCase()
      .replace(new RegExp('ä', 'g'), 'ae')
      .replace(new RegExp('ö', 'g'), 'oe')
      .replace(new RegExp('ü', 'g'), 'ue')
      .replace(new RegExp('ß', 'g'), 'ss')
      .replace(new RegExp('ß', 'g'), 'ss')
      .replace(new RegExp('\\.', 'g'), 'dot')
      .replace(new RegExp('\\+', 'g'), 'plus')
      .replace(new RegExp('\\/', 'g'), 'slash')
      .replace(new RegExp('&', 'g'), 'and')
      .replace(new RegExp('#', 'g'), 'sharp') : '';
  }

  /**
   * Splits a item into an array of items using space as an delimiter where words can be grouped by surrounding them
   * with double quotes
   * @param items
   */
  private splitSearchItems(items: string): string[] {
    if (items == null) {
      return [];
    }

    const itemArray = this.normalize(items).match(/\w+|"[^"]+"/g);

    if (itemArray == null) {
      return [];
    }

    let i = itemArray.length;
    while (i--) {
      itemArray[i] = itemArray[i].replace(/"/g, '');
    }

    return itemArray;
  }
}
