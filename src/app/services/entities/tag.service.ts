import {Injectable, isDevMode} from '@angular/core';
import {Subject} from 'rxjs/index';
import {Tag} from '../../model/entities/tag.model';
import {SuggestionService} from './filter/suggestion.service';
import {takeUntil} from 'rxjs/internal/operators';
import {EntityType} from '../../model/entities/entity-type.enum';
import {environment} from '../../../environments/environment';
import {Scope} from '../../model/scope.enum';
import {ScopeService} from './scope/scope.service';
import {PouchDBService} from '../persistence/pouchdb.service';
import {SnackbarService} from '../ui/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  tags = new Map<string, Tag>();
  tagsSubject = new Subject<Tag[]>();

  private unsubscribeSubject = new Subject();

  constructor(private pouchDBService: PouchDBService,
              private suggestionService: SuggestionService,
              private snackbarService: SnackbarService,
              private scopeService: ScopeService) {
    this.initializeSubscription();
    this.findTagsByScope(this.scopeService.scope);
  }

  //
  // Initialization
  //

  // <editor-fold desc="Initialization">

  private initializeSubscription() {
    this.tagsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
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

  public findTagsByScope(scope: Scope) {
    const index = {fields: ['entityType', 'scope', 'creationDate']};
    const options = {
      selector: {
        $and: [
          {entityType: {$eq: EntityType.TAG}},
          {scope: {$eq: scope}},
          {creationDate: {$gt: null}}
        ]
      },
      // sort: [{'creationDate': 'desc'}],
      limit: environment.LIMIT_TAGS
    };

    this.clearTags();
    this.findTagsInternal(index, options);
  }

  private clearTags() {
    this.tags = new Map<string, Tag>();
  }

  private findTagsInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {

        result['docs'].forEach(element => {
          const tag = element as Tag;
          this.tags.set(tag.id, tag);
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

  public createTag(tag: Tag) {
    if (tag != null) {
      tag.scope = this.scopeService.scope;

      return this.pouchDBService.upsert(tag.id, tag).then(() => {
        this.snackbarService.showSnackbar('Added tag');
        this.tags.set(tag.id, tag);
        this.notify();
      });
    }
  }

  public updateTag(tag: Tag, showSnack: boolean) {
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
  }

  public deleteTag(tag: Tag) {
    if (tag != null) {
      return this.pouchDBService.remove(tag.id, tag).then(() => {
        this.snackbarService.showSnackbar('Deleted tag');
        this.tags.delete(tag.id);
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
    this.tagsSubject.next(Array.from(this.tags.values()).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() - new Date(t1.modificationDate).getTime();
    }));
  }

  // </editor-fold>

  //
  // Lookup
  //

  // <editor-fold desc="Lookup">

  public getTagById(id: string) {
    return this.tags.get(id);
  }

  public getTagByName(name: string): Tag {
    let tag: Tag = null;

    Array.from(this.tags.values()).forEach(t => {
      if (t.name === name) {
        tag = t;
      }
    });

    return tag;
  }

  // </editor-fold>
}
