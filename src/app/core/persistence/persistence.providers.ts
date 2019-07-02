import {PouchDBService} from './services/pouchdb.service';
import {PouchDBSettingsService} from './services/pouchdb-settings.service';

/** Providers for persistence module */
export const PersistenceProviders = [
  PouchDBService,
  PouchDBSettingsService
];
