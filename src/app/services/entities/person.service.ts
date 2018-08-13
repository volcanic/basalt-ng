import {Injectable, isDevMode} from '@angular/core';
import {Subject} from 'rxjs/index';
import {Person} from '../../model/entities/person.model';
import {takeUntil} from 'rxjs/internal/operators';
import {SuggestionService} from './filter/suggestion.service';
import {EntityType} from '../../model/entities/entity-type.enum';
import {environment} from '../../../environments/environment';
import {Scope} from '../../model/scope.enum';
import {PouchDBService} from '../persistence/pouchdb.service';
import {ScopeService} from './scope/scope.service';
import {SnackbarService} from '../ui/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  persons = new Map<string, Person>();
  personsSubject = new Subject<Person[]>();

  private unsubscribeSubject = new Subject();

  constructor(private pouchDBService: PouchDBService,
              private suggestionService: SuggestionService,
              private snackbarService: SnackbarService,
              private scopeService: ScopeService) {
    this.initializeSubscription();
    this.findPersonsByScope(this.scopeService.scope);
  }

  //
  // Initialization
  //

  // <editor-fold desc="Initialization">

  private initializeSubscription() {
    this.personsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
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

  public findPersonsByScope(scope: Scope) {
    const index = {fields: ['entityType', 'scope', 'creationDate']};
    const options = {
      selector: {
        $and: [
          {entityType: {$eq: EntityType.PERSON}},
          {scope: {$eq: scope}},
          {creationDate: {$gt: null}}
        ]
      },
      // sort: [{'creationDate': 'desc'}],
      limit: environment.LIMIT_PERSONS
    };

    this.clearPersons();
    this.findPersonsInternal(index, options);
  }

  private clearPersons() {
    this.persons = new Map<string, Person>();
  }

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

  // </editor-fold>

  //
  // Persistence
  //

  // <editor-fold desc="Persistence">

  public createPerson(person: Person) {
    if (person != null) {
      // Remove transient attributes
      person.checked = undefined;

      person.scope = this.scopeService.scope;

      return this.pouchDBService.upsert(person.id, person).then(() => {
        this.snackbarService.showSnackbar('Added person');
        this.persons.set(person.id, person);
        this.notify();
      });
    }
  }

  public updatePerson(person: Person, showSnack: boolean) {
    if (person != null) {
      // Remove transient attributes
      person.checked = undefined;

      person.modificationDate = new Date();

      return this.pouchDBService.upsert(person.id, person).then(() => {
        if (showSnack) {
          this.snackbarService.showSnackbar('Updated person');
        }
        this.persons.set(person.id, person);
        this.notify();
      });
    }
  }

  public deletePerson(person: Person) {
    if (person != null) {
      return this.pouchDBService.remove(person.id, person).then(() => {
        this.snackbarService.showSnackbar('Deleted person');
        this.persons.delete(person.id);
        this.notify();
      });
    }
  }

  // </editor-fold>

  //
  // Notification
  //

  // <editor-fold desc="Notification">

  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    this.personsSubject.next(Array.from(this.persons.values()).sort((p1, p2) => {
      return new Date(p2.modificationDate).getTime() - new Date(p1.modificationDate).getTime();
    }));
  }

  // </editor-fold>

  //
  // Lookup
  //

  // <editor-fold desc="Lookup">

  public getPersonById(id: string) {
    return this.persons.get(id);
  }

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
}
