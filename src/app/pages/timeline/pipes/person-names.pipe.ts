import {Pipe, PipeTransform} from '@angular/core';
import {Person} from '../../../core/entity/model/person.model';
import {PersonService} from '../../../core/entity/services/person/person.service';

/**
 * Transforms a list of persons into a list of their names
 */
@Pipe({
  name: 'personNames'
})
export class PersonNamesPipe implements PipeTransform {

  /**
   * Transforms a list of persons into a list of their names
   * @param persons persons
   * @param args arguments
   */
  transform(persons: Person[], args?: any): string[] {
    return persons.map(person => {
      return person.name;
    });
  }
}
