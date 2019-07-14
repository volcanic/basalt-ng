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

  /** Map of all persons */
  persons = new Map<string, Person>();
  /** Subject that can be subscribed by components that are interested in changes */
  personsSubject = new Subject<Map<string, Person>>();

  /** Person in focus */
  person: Person;
  /** Subject that publishes person */
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
      Array.from(value.values()).forEach(person => {
          this.persons.set(person.id, person);
        }
      );

      this.suggestionService.updateByPersons(Array.from(this.persons.values()));
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

    this.clearPersons();
    this.findPersonsInternal(index, options);
  }

  /**
   * Clears persons
   */
  private clearPersons() {
    this.persons.clear();
  }

  /**
   * Index persons and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findPersonsInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        if (result != null) {
          result['docs'].forEach(element => {
            const person = element as Person;
            this.persons.set(person.id, person);
          });
          this.notify();
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
   */
  public createPerson(person: Person): Promise<any> {
    return new Promise(() => {
      if (person != null) {
        person.scope = this.scopeService.scope;

        return this.pouchDBService.upsert(person.id, person).then(() => {
          this.snackbarService.showSnackbar('Added person');
          this.persons.set(person.id, person);
          this.notify();
        });
      }
    });
  }

  /**
   * Updates existing person
   * @param person person to be updated
   * @param showSnack shows snackbar if true
   */
  public updatePerson(person: Person, showSnack: boolean = false): Promise<any> {
    return new Promise(() => {
      if (person != null) {
        person.modificationDate = new Date();

        return this.pouchDBService.upsert(person.id, person).then(() => {
          if (showSnack) {
            this.snackbarService.showSnackbar('Updated person');
          }
          this.persons.set(person.id, person);
          this.notify();
        });
      }
    });
  }

  /**
   * Deletes a person
   * @param person person to be deleted
   */
  public deletePerson(person: Person): Promise<any> {
    return new Promise(() => {
      if (person != null) {
        return this.pouchDBService.remove(person.id, person).then(() => {
          this.snackbarService.showSnackbar('Deleted person');
          this.persons.delete(person.id);
          this.notify();
        }).catch((error) => {
          if (isDevMode()) {
            console.error(error);
          }
          this.snackbarService.showSnackbarWithAction('An error occurred during deletion', 'RETRY', () => {
            this.deletePerson(person).then(() => {
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
   * Retrieves a person by a given ID
   * @param id ID to find person by
   * @returns person identified by given ID, null if no such person exists
   */
  public getPersonById(id: string): Person {
    return this.persons.get(id);
  }

  /**
   * Retrieves a person by a given name
   * @param name name to find person by
   * @returns person identified by given name, null if no such person exists
   */
  public getPersonByName(name: string): Person {
    let person: Person = null;

    Array.from(this.persons.values()).forEach(p => {
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
   */
  private notify() {
    this.personSubject.next(this.person);
    this.personsSubject.next(this.persons);
  }
}
