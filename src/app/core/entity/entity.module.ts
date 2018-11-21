import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntityService} from './services/entity.service';
import {PersonService} from './services/person.service';
import {ProjectService} from './services/project.service';
import {TagService} from './services/tag.service';
import {TaskService} from './services/task/task.service';
import {TaskletService} from './services/tasklet/tasklet.service';
import {ScopeService} from './services/scope.service';
import {FilterService} from './services/filter.service';
import {MatchService} from './services/match.service';
import {SuggestionService} from './services/suggestion.service';
import {CloneService} from './services/clone.service';
import {DateService} from './services/date.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    CloneService,
    DateService,
    EntityService,
    FilterService,
    MatchService,
    PersonService,
    ProjectService,
    ScopeService,
    SuggestionService,
    TagService,
    TaskService,
    TaskletService
  ]
})
/**
 * Contains services related to entities
 */
export class EntityModule {
}
