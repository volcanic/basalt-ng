import {Pipe, PipeTransform} from '@angular/core';
import {Person} from '../../../core/entity/model/person.model';

/**
 * Transforms a list of persons into a list of their names
 */
@Pipe({
  name: 'personNames'
})
export class PersonNamesPipe implements PipeTransform {

  /**
   * Transforms a list of persons into a list of their names
   * @param persons lists of persons
   * @param args arguments
   */
  transform(persons: Person[], args?: any): string[] {
    return persons.map(person => {
      return person.name;
    });
  }
}
