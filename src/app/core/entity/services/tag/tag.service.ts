import {Injectable, isDevMode} from '@angular/core';
import {Subject} from 'rxjs';
import {Tag} from '../../model/tag.model';
import {SuggestionService} from '../suggestion.service';
import {EntityType} from '../../model/entity-type.enum';
import {environment} from '../../../../../environments/environment';
import {Scope} from '../../model/scope.enum';
import {ScopeService} from '../scope.service';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {SnackbarService} from '../../../ui/services/snackbar.service';
import {DateService} from '../date.service';

/**
 * Handles tags including
 * <li> Queries
 * <li> Persistence
 * <li> Lookup
 * <li> Sort
 */

/* tslint:disable:object-literal-key-quotes */
@Injectable({
  providedIn: 'root'
})
export class TagService {

  /** Subject that publishes tags */
  tagsSubject = new Subject<Map<string, Tag>>();
  /** Subject that publishes a tag */
  tagSubject = new Subject<Tag>();

  //
  // Sort
  //

  /**
   * Sorts tags by name
   * @param t1 tags
   * @param t2 tags
   */
  static sortTagsByName(t1: Tag, t2: Tag) {
    return t2.name < t1.name ? 1 : -1;
  }

  /**
   * Sorts tags by modification date
   * @param t1 tag
   * @param t2 tag
   */
  static sortTagsByModificationDate(t1: Tag, t2: Tag) {
    return new Date(t2.modificationDate).getTime() - new Date(t1.modificationDate).getTime();
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
    this.initializeTagSubscription();
  }

  //
  // Initialization
  //

  /**
   * Initializes tag subscription
   */
  private initializeTagSubscription() {
    this.tagsSubject.subscribe((value) => {
      this.suggestionService.updateByTags(Array.from((value as Map<string, Tag>).values()));
    });
  }

  //
  // Queries
  //

  /**
   * Loads tags by a given scope
   */
  public findTags() {
    const startDate = DateService.addDays(new Date(), -(environment.LIMIT_TAGS_DAYS));

    const index = {fields: ['entityType', 'modificationDate']};
    const options = {
      selector: {
        $and: [
          {entityType: {$eq: EntityType.TAG}},
          {modificationDate: {$gt: startDate.toISOString()}}
        ]
      },
      // sort: [{'modificationDate': 'desc'}],
      limit: environment.LIMIT_TAGS_COUNT
    };

    this.findTagsInternal(index, options);
  }

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
      // sort: [{'modificationDate': 'desc'}],
      limit: environment.LIMIT_TAGS_COUNT
    };

    this.findTagsInternal(index, options);
  }

  /**
   * Index tags and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findTagsInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        if (result != null) {
          const tags = new Map<string, Tag>();

          result['docs'].forEach(element => {
            const tag = element as Tag;
            tags.set(tag.id, tag);
          });
          this.notifyTags(tags);
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
   * Creats a new tag
   * @param tag tag to be created
   * @param tagsMap tags map
   */
  public createTag(tag: Tag, tagsMap: Map<string, Tag>): Promise<any> {
    return new Promise(() => {
      if (tag != null) {
        tag.scope = this.scopeService.scope;

        return this.pouchDBService.upsert(tag.id, tag).then(() => {
          tagsMap.set(tag.id, tag);
          this.notifyTag(tag);
          this.notifyTags(tagsMap);
        });
      }
    });
  }

  /**
   * Updates existing tag
   * @param tag tag to be updated
   * @param tagsMap tags map
   */
  public updateTag(tag: Tag, tagsMap: Map<string, Tag>): Promise<any> {
    return new Promise(() => {
      if (tag != null) {
        tag.modificationDate = new Date();

        return this.pouchDBService.upsert(tag.id, tag).then(() => {
          tagsMap.set(tag.id, tag);
          this.notifyTag(tag);
          this.notifyTags(tagsMap);
        });
      }
    });
  }

  /**
   * Deletes a tag
   * @param tag tag to be deleted
   * @param tagsMap tag map
   */
  public deleteTag(tag: Tag, tagsMap: Map<string, Tag>): Promise<any> {
    return new Promise(() => {
      if (tag != null) {
        this.pouchDBService.remove(tag.id, tag).then(() => {
          tagsMap.delete(tag.id);
          this.notifyTags(tagsMap);
        }).catch((error) => {
          if (isDevMode()) {
            console.error(error);
          }
          this.snackbarService.showSnackbarWithAction('An error occurred during deletion', 'RETRY', () => {
            this.deleteTag(tag, tagsMap).then(() => {
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
   * Retrieves a tag by a given name
   * @param name name to find tag by
   * @param tagsMap tags map
   * @returns tag identified by given name, null if no such tag exists
   */
  public getTagByName(name: string, tagsMap: Map<string, Tag>): Tag {
    let tag: Tag = null;

    Array.from(tagsMap.values()).forEach(t => {
      if (t.name === name) {
        tag = t;
      }
    });

    return tag;
  }

  /**
   * Retrieves a list of unused tags
   * @param usedTagIds used tag IDs map
   * @param tagsMap tags map
   */
  public getUnusedTags(usedTagIds: Map<string, string>, tagsMap: Map<string, Tag>): Map<string, Tag> {
    const unusedTags = new Map<string, Tag>();

    Array.from(tagsMap.values()).forEach(tag => {
      if (!Array.from(usedTagIds.values()).some(id => {
        return id === tag.id;
      })) {
        unusedTags.set(tag.id, tag);
      }
    });


    return unusedTags;
  }

  //
  // Notification
  //

  /**
   * Notifies subscribers that something has changed
   * @param tag tag
   */
  public notifyTag(tag: Tag) {
    this.tagSubject.next(tag);
  }

  /**
   * Notifies subscribers that something has changed
   * @param tagsMap tags map
   */
  public notifyTags(tagsMap: Map<string, Tag>) {
    this.tagsSubject.next(tagsMap);
  }
}
