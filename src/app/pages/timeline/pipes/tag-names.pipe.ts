import {Pipe, PipeTransform} from '@angular/core';
import {Tag} from '../../../core/entity/model/tag.model';
import {TagService} from '../../../core/entity/services/tag/tag.service';

/**
 * Transforms a list of tags into a list of their names
 */
@Pipe({
  name: 'tagNames'
})
export class TagNamesPipe implements PipeTransform {

  /**
   * Transforms a list of tags into a list of their names
   * @param tags tags
   * @param args arguments
   */
  transform(tags: Tag[], args?: any): string[] {
    return tags.map(tag => {
      return tag.name;
    });
  }
}
