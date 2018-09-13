/**
 * Environment settings for production environment
 * @type {{production: boolean; APP_NAME: string; DATABASE_ENTITIES: string; DATABASE_SETTINGS: string; LIMIT_PROJECTS: number; LIMIT_TASKS: number; LIMIT_TASKLETS: number; LIMIT_PERSONS: number; LIMIT_TAGS: number; NAME: any; VERSION: any; LICENSE: string | any; HOMEPAGE: string | any; TAGS: any}}
 */
export const environment = {
  production: true,
  APP_NAME: 'Basalt',
  DATABASE_ENTITIES: 'basalt',
  DATABASE_SETTINGS: 'basalt_settings',
  LIMIT_PROJECTS: 50,
  LIMIT_TASKS: 50,
  LIMIT_TASKLETS: 100,
  LIMIT_PERSONS: 100,
  LIMIT_TAGS: 100,
  NAME: require('../../package.json').name,
  VERSION: require('../../package.json').version,
  LICENSE: require('../../package.json').license,
  HOMEPAGE: require('../../package.json').homepage,
  TAGS: require('../../tags.json').tags,
};
