import {Injectable, isDevMode} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Person} from '../model/person.model';
import {SuggestionService} from './suggestion.service';
import {EntityType} from '../model/entity-type.enum';
import {environment} from '../../../../environments/environment';
import {Scope} from '../model/scope.enum';
import {PouchDBService} from '../../persistence/services/pouchdb.service';
import {ScopeService} from './scope.service';
import {SnackbarService} from '../../ui/services/snackbar.service';
import {DateService} from './date.service';
import {Task} from '../model/task.model';

/**
 * Handles persons including
 * <li> Queries
 * <li> Persistence
 * <li> Lookup
 */
@Injectable({
  providedIn: 'root'
})
export class PersonService {

  /** Map of all persons */
  persons = new Map<string, Person>();
  /** Subject that can be subscribed by components that are interested in changes */
  personsSubject = new Subject<Person[]>();

  /** Person in focus */
  person: Person;
  /** Subject that publishes person */
  personSubject = new Subject<Person>();
  
  /** Special person representing the user */
  myself: Person;

  /**
   * Constructor
   * @param {PouchDBService} pouchDBService
   * @param {SuggestionService} suggestionService
   * @param {SnackbarService} snackbarService
   * @param {ScopeService} scopeService
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

  // <editor-fold desc="Initialization">

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
      (value as Person[]).forEach(person => {
          this.persons.set(person.id, person);
        }
      );

      this.suggestionService.updateByPersons(Array.from(this.persons.values()));
    });
  }

  // </editor-fold>

  //
  // Queries
  //

  // <editor-fold desc="Queries">

  /**
   * Loads persons by a given scope
   * @param {Scope} scope scope to filter by
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
   * Loads person by a given ID
   * @param {number} id ID of filter by
   */
  public findPersonByID(id: string) {
    const index = {fields: ['entityType', 'id', 'creationDate']};
    const options = {
      selector: {
        '$and': [
          {entityType: {$eq: EntityType.PERSON}},
          {id: {$eq: id}}
        ]
      },
      // sort: [{creationDate: 'desc'}],
      limit: environment.LIMIT_PERSONS_COUNT
    };

    this.findPersonInternal(index, options);
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

        result['docs'].forEach(element => {
          const person = element as Person;
          this.persons.set(person.id, person);
        });
        this.notify();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  /**
   * Index persons and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findPersonInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        result['docs'].forEach(element => {
          const person = element as Person;

          this.person = person;
          this.persons.set(person.id, person);
        });
        this.notify();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  // </editor-fold>

  //
  // Persistence
  //

  // <editor-fold desc="Persistence">

  /**
   * Creates a new person
   * @param {Person} person person to be created
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
   * @param {Person} person person to be updated
   * @param {boolean} showSnack shows snackbar if true
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
   * @param {Person} person person to be deleted
   */
  public deletePerson(person: Person): Promise<any> {
    return new Promise(() => {
      if (person != null) {
        return this.pouchDBService.remove(person.id, person).then(() => {
          this.snackbarService.showSnackbar('Deleted person');
          this.persons.delete(person.id);
          this.notify();
        });
      }
    });
  }

  // </editor-fold>

  //
  // Lookup
  //

  // <editor-fold desc="Lookup">

  /**
   * Retrieves a person by a given ID
   * @param {string} id ID to find person by
   * @returns {Person} person identified by given ID, null if no such person exists
   */
  public getPersonById(id: string): Person {
    return this.persons.get(id);
  }

  /**
   * Retrieves a person by a given name
   * @param {string} name name to find person by
   * @returns {Person} person identified by given name, null if no such person exists
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

  // </editor-fold>

  //
  // Notification
  //

  // <editor-fold desc="Notification">

  /**
   * Notifies subscribers that something has changed
   */
  private notify() {
    this.personSubject.next(this.person);
    this.personsSubject.next(Array.from(this.persons.values()).sort((p1, p2) => {
      return p2.name < p1.name ? 1 : -1;
    }).sort((p1, p2) => {
      return new Date(p2.modificationDate).getTime() - new Date(p1.modificationDate).getTime();
    }));
  }

  // </editor-fold>
}
