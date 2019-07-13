import {Injectable, isDevMode} from '@angular/core';
import {Subject} from 'rxjs';
import {Tag} from '../model/tag.model';
import {SuggestionService} from './suggestion.service';
import {EntityType} from '../model/entity-type.enum';
import {environment} from '../../../../environments/environment';
import {Scope} from '../model/scope.enum';
import {ScopeService} from './scope.service';
import {PouchDBService} from '../../persistence/services/pouchdb.service';
import {SnackbarService} from '../../ui/services/snackbar.service';
import {DateService} from './date.service';

/**
 * Handles tags including
 * <li> Queries
 * <li> Persistence
 * <li> Lookup
 */

/* tslint:disable:object-literal-key-quotes */
@Injectable({
  providedIn: 'root'
})
export class TagService {

  /** Map of all tags */
  tags = new Map<string, Tag>();
  /** Subject that can be subscribed by components that are interested in changes */
  tagsSubject = new Subject<Tag[]>();

  /** Tag in focus */
  tag: Tag;
  /** Subject that publishes tag */
  tagSubject = new Subject<Tag>();

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
    this.initializeTagSubscription();
    this.findTagsByScope(this.scopeService.scope);
  }

  //
  // Initialization
  //

  // <editor-fold desc="Initialization">

  /**
   * Initializes tag subscription
   */
  private initializeTagSubscription() {
    this.tagsSubject.subscribe((value) => {
      (value as Tag[]).forEach(tag => {
          this.tags.set(tag.id, tag);
        }
      );

      this.suggestionService.updateByTags(Array.from(this.tags.values()));
    });
  }

  // </editor-fold>

  //
  // Queries
  //

  // <editor-fold desc="Queries">

  /**
   * Loads tags by a given scope
   * @param scope scope to filter by
   */
  public findTagsByScope(scope: Scope) {
    const startDate = DateService.addDays(new Date(), -(environment.LIMIT_TAGS_DAYS));

    const index = {fields: ['entityType', 'scope', 'modificationDate']};
    const options = {
      selector: {
        $and: [
          {entityType: {$eq: EntityType.TAG}},
          {scope: {$eq: this.scopeService.scope}},
          {modificationDate: {$gt: startDate.toISOString()}}
        ]
      },
      // sort: [{'creationDate': 'desc'}],
      limit: environment.LIMIT_TAGS_COUNT
    };

    this.clearTags();
    this.findTagsInternal(index, options);
  }

  /**
   * Loads tag by a given ID
   * @param id ID of filter by
   */
  public findTagByID(id: string) {
    const index = {fields: ['entityType', 'id', 'creationDate']};
    const options = {
      selector: {
        '$and': [
          {entityType: {$eq: EntityType.TAG}},
          {id: {$eq: id}}
        ]
      },
      // sort: [{creationDate: 'desc'}],
      limit: environment.LIMIT_TAGS_COUNT
    };

    this.findTagInternal(index, options);
  }

  /**
   * Clears tags
   */
  private clearTags() {
    this.tags.clear();
  }

  /**
   * Index tags and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findTagsInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        if (result != null) {
          result['docs'].forEach(element => {
            const tag = element as Tag;
            this.tags.set(tag.id, tag);
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

  /**
   * Index tags and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findTagInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        if (result != null) {
          result['docs'].forEach(element => {
            const tag = element as Tag;

            this.tag = tag;
            this.tags.set(tag.id, tag);
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

  // </editor-fold>

  //
  // Persistence
  //

  // <editor-fold desc="Persistence">

  /**
   * Creats a new tag
   * @param tag tag to be created
   */
  public createTag(tag: Tag): Promise<any> {
    return new Promise(() => {
      if (tag != null) {
        tag.scope = this.scopeService.scope;

        return this.pouchDBService.upsert(tag.id, tag).then(() => {
          this.snackbarService.showSnackbar('Added tag');
          this.tags.set(tag.id, tag);
          this.notify();
        });
      }
    });
  }

  /**
   * Updates existing tag
   * @param tag tag to be updated
   * @param showSnack shows snackbar if true
   */
  public updateTag(tag: Tag, showSnack: boolean = false): Promise<any> {
    return new Promise(() => {
      if (tag != null) {
        tag.modificationDate = new Date();

        return this.pouchDBService.upsert(tag.id, tag).then(() => {
          if (showSnack) {
            this.snackbarService.showSnackbar('Updated tag');
          }
          this.tags.set(tag.id, tag);
          this.notify();
        });
      }
    });
  }

  /**
   * Deletes a tag
   * @param tag tag to be deleted
   */
  public deleteTag(tag: Tag): Promise<any> {
    return new Promise(() => {
      if (tag != null) {
        return this.pouchDBService.remove(tag.id, tag).then(() => {
          this.snackbarService.showSnackbar('Deleted tag');
          this.tags.delete(tag.id);
          this.notify();
        }).catch((error) => {
          if (isDevMode()) {
            console.error(error);
          }
          this.snackbarService.showSnackbarWithAction('An error occurred during deletion', 'RETRY', () => {
            this.deleteTag(tag).then(() => {
            });
          });
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
   * Retrieves a tag by a given ID
   * @param id ID to find tag by
   * @returns tag identified by given ID, null if no such tag exists
   */
  public getTagById(id: string): Tag {
    return this.tags.get(id);
  }

  /**
   * Retrieves a tag by a given name
   * @param name name to find tag by
   * @returns tag identified by given name, null if no such tag exists
   */
  public getTagByName(name: string): Tag {
    let tag: Tag = null;

    Array.from(this.tags.values()).forEach(t => {
      if (t.name === name) {
        tag = t;
      }
    });

    return tag;
  }

  /**
   * Retrieves a list of unused tags
   * @param usedTagIds used tag IDs
   */
  public getUnusedTags(usedTagIds: string[]): Tag[] {
    const unusedTags = new Map<Tag, Tag>();

    this.tags.forEach(tag => {
      if (!usedTagIds.some(id => {
        return id === tag.id;
      })) {
        unusedTags.set(tag, tag);
      }
    });


    return Array.from(unusedTags.values());
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
    this.tagSubject.next(this.tag);
    this.tagsSubject.next(Array.from(this.tags.values()).sort((t1, t2) => {
      return t2.name < t1.name ? 1 : -1;
    }).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() - new Date(t1.modificationDate).getTime();
    }));
  }

  // </editor-fold>
}
