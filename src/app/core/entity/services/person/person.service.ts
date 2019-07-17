import {Injectable, isDevMode} from '@angular/core';
import {Subject} from 'rxjs';
import {Person} from '../../model/person.model';
import {SuggestionService} from '../suggestion.service';
import {EntityType} from '../../model/entity-type.enum';
import {environment} from '../../../../../environments/environment';
import {Scope} from '../../model/scope.enum';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {ScopeService} from '../scope.service';
import {SnackbarService} from '../../../ui/services/snackbar.service';
import {DateService} from '../date.service';

/**
 * Handles persons including
 * <li> Queries
 * <li> Persistence
 * <li> Lookup
 * <li> Sort
 */

/* tslint:disable:object-literal-key-quotes */
@Injectable({
  providedIn: 'root'
})
export class PersonService {

  /** Subject that publishes persons */
  personsSubject = new Subject<Map<string, Person>>();
  /** Subject that publishes a person */
  personSubject = new Subject<Person>();

  /** Special person representing the user */
  myself: Person;

  //
  // Sort
  //

  /**
   * Sorts persons by name
   * @param p1 person
   * @param p2 person
   */
  static sortPersonsByName(p1: Person, p2: Person) {
    return p2.name < p1.name ? 1 : -1;
  }

  /**
   * Sorts persons by modification date
   * @param p1 person
   * @param p2 person
   */
  static sortPersonsByModificationDate(p1: Person, p2: Person) {
    return new Date(p2.modificationDate).getTime() - new Date(p1.modificationDate).getTime();
  }

  /**
   * Constructor
   * @param pouchDBService pouchDB service
   * @param suggestionService suggestion service
   * @param snackbarService snackbar service
   * @param scopeService scope service
   */
  constructor(private pouchDBService: PouchDBService,
              private suggestionService: SuggestionService,
              private snackbarService: SnackbarService,
              private scopeService: ScopeService) {
    this.initializeMyself();
    this.initializePersonSubscription();
    this.findPersonsByScope(this.scopeService.scope);
  }

  //
  // Initialization
  //

  /**
   * Initializes a special person representing the user
   */
  initializeMyself() {
    this.myself = new Person('Myself');
  }

  /**
   * Initializes person subscription
   */
  private initializePersonSubscription() {
    this.personsSubject.subscribe((value) => {
      this.suggestionService.updateByPersons(Array.from((value as Map<string, Person>).values()));
    });
  }

  //
  // Queries
  //

  /**
   * Loads persons by a given scope
   * @param scope scope to filter by
   */
  public findPersonsByScope(scope: Scope) {
    const startDate = DateService.addDays(new Date(), -(environment.LIMIT_PERSONS_DAYS));

    const index = {fields: ['entityType', 'scope', 'modificationDate']};
    const options = {
      selector: {
        $and: [
          {entityType: {$eq: EntityType.PERSON}},
          {scope: {$eq: scope}},
          {modificationDate: {$gt: startDate.toISOString()}}
        ]
      },
      // sort: [{'creationDate': 'desc'}],
      limit: environment.LIMIT_PERSONS_COUNT
    };

    this.findPersonsInternal(index, options);
  }

  /**
   * Index persons and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findPersonsInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        if (result != null) {
          const persons = new Map<string, Person>();

          result['docs'].forEach(element => {
            const person = element as Person;
            persons.set(person.id, person);
          });
          this.notifyPersons(persons);
        }
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  //
  // Persistence
  //

  /**
   * Creates a new person
   * @param person person to be created
   * @param personsMap persons map
   */
  public createPerson(person: Person, personsMap: Map<string, Person>): Promise<any> {
    return new Promise(() => {
      if (person != null) {
        person.scope = this.scopeService.scope;

        return this.pouchDBService.upsert(person.id, person).then(() => {
          this.snackbarService.showSnackbar('Added person');
          personsMap.set(person.id, person);
          this.notifyPerson(person);
          this.notifyPersons(personsMap);
        });
      }
    });
  }

  /**
   * Updates existing person
   * @param person person to be updated
   * @param personsMap persons map
   */
  public updatePerson(person: Person, personsMap: Map<string, Person>): Promise<any> {
    return new Promise(() => {
      if (person != null) {
        person.modificationDate = new Date();

        return this.pouchDBService.upsert(person.id, person).then(() => {
          personsMap.set(person.id, person);
          this.notifyPerson(person);
          this.notifyPersons(personsMap);
        });
      }
    });
  }

  /**
   * Deletes a person
   * @param person person to be deleted
   * @param personsMap person map
   */
  public deletePerson(person: Person, personsMap: Map<string, Person>): Promise<any> {
    return new Promise(() => {
      if (person != null) {
        this.pouchDBService.remove(person.id, person).then(() => {
          personsMap.delete(person.id);
          this.notifyPersons(personsMap);
        }).catch((error) => {
          if (isDevMode()) {
            console.error(error);
          }
          this.snackbarService.showSnackbarWithAction('An error occurred during deletion', 'RETRY', () => {
            this.deletePerson(person, personsMap).then(() => {
            });
          });
        });
      }
    });
  }

  //
  // Lookup
  //

  /**
   * Retrieves a person by a given name
   * @param name name to find person by
   * @param personsMap persons map
   * @returns person identified by given name, null if no such person exists
   */
  public getPersonByName(name: string, personsMap: Map<string, Person>): Person {
    let person: Person = null;

    Array.from(personsMap.values()).forEach(p => {
      if (p.name === name) {
        person = p;
      }
    });

    return person;
  }

  //
  // Notification
  //

  /**
   * Notifies subscribers that something has changed
   * @param person person
   */
  public notifyPerson(person) {
    this.personSubject.next(person);
  }

  /**
   * Notifies subscribers that something has changed
   * @param personsMap persons map
   */
  public notifyPersons(personsMap: Map<string, Person>) {
    this.personsSubject.next(personsMap);
  }
}
