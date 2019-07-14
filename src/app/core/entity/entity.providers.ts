import {CloneService} from './services/clone.service';
import {DateService} from './services/date.service';
import {EntityService} from './services/entity.service';
import {FilterService} from './services/filter.service';
import {MatchService} from './services/match.service';
import {PersonService} from './services/person/person.service';
import {ProjectService} from './services/project/project.service';
import {ScopeService} from './services/scope.service';
import {SuggestionService} from './services/suggestion.service';
import {TagService} from './services/tag/tag.service';
import {TaskService} from './services/task/task.service';
import {TaskletService} from './services/tasklet/tasklet.service';

/** Providers for entity module */
export const EntityProviders = [
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
];
